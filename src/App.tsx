import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import {
  Alert,
  Button,
  Card,
  ConfigProvider,
  Form,
  Input,
  Layout,
  message,
  Modal,
  Select,
  Space,
  Typography,
  theme
} from "antd";
import { useTranslation } from "react-i18next";
import { ENV } from "./config/env";
import { EnhancementLoadingOverlay } from "./components/EnhancementLoadingOverlay";
import { ParticleNetworkBackground } from "./components/ParticleNetworkBackground";
import {
  BUSINESS_STYLE,
  BusinessType,
  QualityPreset,
  downloadZip,
  enhanceFoodPhotos
} from "./services/photoEnhanceService";

const BUSINESS_TYPES = Object.keys(BUSINESS_STYLE) as BusinessType[];
type BusinessTypeSelection = BusinessType | "";
const QUALITY_PRESET_OPTIONS: QualityPreset[] = ["low", "medium", "high"];
const LANGUAGE_OPTIONS = [
  { value: "en", label: "EN" },
  { value: "ru", label: "RU" },
  { value: "fr", label: "FR" },
  { value: "ua", label: "UA" },
  { value: "de", label: "DE" }
] as const;
type AppLanguage = (typeof LANGUAGE_OPTIONS)[number]["value"];
const SUPPORT_MESSAGE_MAX = 2000;
const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

function isImageFile(file: File): boolean {
  if (file.type && file.type.startsWith("image/")) {
    return true;
  }
  return /\.(jpe?g|png|gif|webp|bmp|svg|heic|heif)$/i.test(file.name);
}

function fileKey(file: File): string {
  return `${file.name}:${file.size}:${file.lastModified}`;
}

function mergeIncomingImages(
  previous: File[],
  incoming: File[],
  max: number,
  t: (key: string, options?: Record<string, unknown>) => string
): { next: File[]; error: string } {
  const existingKeys = new Set(previous.map(fileKey));
  const uniqueNew: File[] = [];
  for (const file of incoming) {
    const key = fileKey(file);
    if (existingKeys.has(key)) {
      continue;
    }
    existingKeys.add(key);
    uniqueNew.push(file);
  }

  const remainingSlots = max - previous.length;
  if (remainingSlots <= 0) {
    if (uniqueNew.length > 0) {
      return {
        next: previous,
        error: t("errors.panelFull", { max })
      };
    }
    if (incoming.length > 0) {
      return { next: previous, error: t("errors.allDuplicates") };
    }
    return { next: previous, error: "" };
  }

  const accepted = uniqueNew.slice(0, remainingSlots);
  const skipped = uniqueNew.length - accepted.length;

  if (skipped > 0) {
    return {
      next: [...previous, ...accepted],
      error: t("errors.someNotAdded", { skipped, max })
    };
  }

  if (uniqueNew.length === 0 && incoming.length > 0) {
    return { next: previous, error: t("errors.allDuplicates") };
  }

  return { next: [...previous, ...accepted], error: "" };
}

const PREVIEW_STAGGER_MS = 72;
const PREVIEW_EXIT_MS = 320;
const PREVIEW_ENTER_MS = 420;

function App() {
  const { t, i18n } = useTranslation();
  const [files, setFiles] = useState<File[]>([]);
  const [businessType, setBusinessType] = useState<BusinessTypeSelection>("");
  const [qualityPreset, setQualityPreset] = useState<QualityPreset>("low");
  const [userInput, setUserInput] = useState<string>("");
  const [language, setLanguage] = useState<AppLanguage>("en");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [readyZipBlob, setReadyZipBlob] = useState<Blob | null>(null);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [supportDraft, setSupportDraft] = useState("");
  const [dragOverPanel, setDragOverPanel] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const filesRef = useRef<File[]>(files);
  const previewUrlMapRef = useRef(new Map<string, string>());
  const [previewEpoch, setPreviewEpoch] = useState(0);
  const [staggerNewKeys, setStaggerNewKeys] = useState<string[]>([]);
  const [exitingKeys, setExitingKeys] = useState<Set<string>>(() => new Set());
  const exitingKeysRef = useRef(new Set<string>());
  const exitTimersRef = useRef(new Map<string, ReturnType<typeof setTimeout>>());
  const wasLoadingRef = useRef(false);

  const scrollToPageTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const finishedLoading = wasLoadingRef.current && !isLoading;
    wasLoadingRef.current = isLoading;
    if (finishedLoading && (error || success)) {
      requestAnimationFrame(() => {
        scrollToPageTop();
      });
    }
  }, [isLoading, error, success, scrollToPageTop]);

  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  useLayoutEffect(() => {
    const map = previewUrlMapRef.current;
    const wantedKeys = new Set(files.map(fileKey));
    let changed = false;
    for (const [key, url] of [...map.entries()]) {
      if (!wantedKeys.has(key)) {
        URL.revokeObjectURL(url);
        map.delete(key);
        changed = true;
      }
    }
    for (const file of files) {
      const key = fileKey(file);
      if (!map.has(key)) {
        map.set(key, URL.createObjectURL(file));
        changed = true;
      }
    }
    if (changed) {
      setPreviewEpoch((n) => n + 1);
    }
  }, [files]);

  useEffect(() => {
    return () => {
      const map = previewUrlMapRef.current;
      for (const url of map.values()) {
        URL.revokeObjectURL(url);
      }
      map.clear();
    };
  }, []);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [i18n, language]);

  useEffect(() => {
    const keySet = new Set(files.map(fileKey));
    setStaggerNewKeys((prev) => {
      const filtered = prev.filter((k) => keySet.has(k));
      if (
        filtered.length === prev.length &&
        filtered.every((k, index) => k === prev[index])
      ) {
        return prev;
      }
      return filtered;
    });
  }, [files]);

  useEffect(() => {
    if (staggerNewKeys.length === 0) {
      return undefined;
    }
    const ms = PREVIEW_STAGGER_MS * Math.max(0, staggerNewKeys.length - 1) + PREVIEW_ENTER_MS + 100;
    const id = window.setTimeout(() => setStaggerNewKeys([]), ms);
    return () => window.clearTimeout(id);
  }, [staggerNewKeys]);

  useEffect(() => {
    return () => {
      exitTimersRef.current.forEach((tid) => clearTimeout(tid));
      exitTimersRef.current.clear();
      exitingKeysRef.current.clear();
    };
  }, []);

  useEffect(() => {
    const clearDrag = () => setDragOverPanel(false);
    window.addEventListener("dragend", clearDrag);
    return () => window.removeEventListener("dragend", clearDrag);
  }, []);

  const addImageFiles = useCallback(
    (raw: File[]) => {
      setSuccess("");

      const incoming = raw.filter(isImageFile);
      if (!incoming.length) {
        setError("");
        return;
      }

      setReadyZipBlob(null);

      const prev = filesRef.current;
      const oldKeySet = new Set(prev.map(fileKey));
      const { next, error } = mergeIncomingImages(prev, incoming, ENV.maxImages, t);
      const addedInOrder = next.filter((f) => !oldKeySet.has(fileKey(f))).map(fileKey);
      if (addedInOrder.length > 0) {
        setStaggerNewKeys(addedInOrder);
      }
      filesRef.current = next;
      setFiles(next);
      setError(error);
    },
    [t]
  );

  const clearImages = useCallback(() => {
    exitTimersRef.current.forEach((tid) => clearTimeout(tid));
    exitTimersRef.current.clear();
    exitingKeysRef.current.clear();
    setExitingKeys(new Set());
    setStaggerNewKeys([]);
    filesRef.current = [];
    setFiles([]);
    setError("");
    setSuccess("");
  }, []);

  const requestRemoveAt = useCallback(
    (index: number) => {
      if (isLoading) {
        return;
      }
      const file = filesRef.current[index];
      if (!file) {
        return;
      }
      const key = fileKey(file);
      if (exitingKeysRef.current.has(key)) {
        return;
      }
      exitingKeysRef.current.add(key);
      setExitingKeys((prev) => new Set(prev).add(key));

      const timer = window.setTimeout(() => {
        exitTimersRef.current.delete(key);
        exitingKeysRef.current.delete(key);
        setExitingKeys((prev) => {
          const n = new Set(prev);
          n.delete(key);
          return n;
        });
        setFiles((prev) => {
          const next = prev.filter((f) => fileKey(f) !== key);
          filesRef.current = next;
          return next;
        });
        setError("");
      }, PREVIEW_EXIT_MS);
      exitTimersRef.current.set(key, timer);
    },
    [isLoading]
  );

  const openSupportModal = useCallback(() => {
    setSupportDraft("");
    setSupportModalOpen(true);
  }, []);

  const closeSupportModal = useCallback(() => {
    setSupportModalOpen(false);
  }, []);

  const handleSupportSend = useCallback(() => {
    setSupportDraft("");
    setSupportModalOpen(false);
    message.success(t("supportMessageSent"));
  }, [t]);

  const handleDownloadZip = useCallback(() => {
    if (readyZipBlob) {
      downloadZip(readyZipBlob);
    }
  }, [readyZipBlob]);

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!businessType) {
      setError(t("errors.businessTypeRequired"));
      requestAnimationFrame(() => scrollToPageTop());
      return;
    }

    if (!files.length) {
      setError(t("errors.noImages"));
      requestAnimationFrame(() => scrollToPageTop());
      return;
    }

    const filesToSend = files.filter((f) => !exitingKeys.has(fileKey(f)));
    if (!filesToSend.length) {
      setError(t("errors.noImages"));
      requestAnimationFrame(() => scrollToPageTop());
      return;
    }

    setReadyZipBlob(null);

    const instructionsForRequest = userInput;

    try {
      setIsLoading(true);
      const zipBlob = await enhanceFoodPhotos({
        files: filesToSend,
        businessType: businessType as BusinessType,
        qualityPreset,
        userInput: instructionsForRequest
      });

      exitTimersRef.current.forEach((tid) => clearTimeout(tid));
      exitTimersRef.current.clear();
      exitingKeysRef.current.clear();
      setExitingKeys(new Set());
      setStaggerNewKeys([]);
      filesRef.current = [];
      setFiles([]);

      setReadyZipBlob(zipBlob);
      setUserInput("");
      setSuccess(t("success"));
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.generic"));
    } finally {
      setIsLoading(false);
    }
  };

  const hasActiveImages = useMemo(
    () => files.some((f) => !exitingKeys.has(fileKey(f))),
    [files, exitingKeys]
  );

  const statusAlerts =
    error || success ? (
      <>
        {error ? (
          <Alert type="error" title={error} showIcon className="status-alert" />
        ) : null}
        {success ? (
          <Alert type="success" title={success} showIcon className="status-alert" />
        ) : null}
      </>
    ) : null;

  return (
    <div className="app-root">
      <ParticleNetworkBackground />
      <div className="app-root-content">
        <EnhancementLoadingOverlay visible={isLoading} />
        <ConfigProvider
          theme={{
            algorithm: theme.darkAlgorithm,
            token: {
              colorPrimary: "#7f7bff",
              borderRadius: 12,
              colorBgBase: "#0c1022",
              colorBgContainer: "#11162b"
            }
          }}
        >
          <main className="app-shell">
        <header className="app-header">
          <div>
            <Title level={2}>{t("appTitle")}</Title>
            <Paragraph>{t("appDescription")}</Paragraph>
          </div>
          <Space direction="vertical" size={4} className="language-box">
            <Text type="secondary">{t("language")}</Text>
            <Select
              value={language}
              onChange={(value) => setLanguage(value)}
              options={[...LANGUAGE_OPTIONS]}
              className="language-select"
            />
          </Space>
        </header>

        {statusAlerts ? (
          <div className="status-alerts status-alerts--top">
            {statusAlerts}
          </div>
        ) : null}

        <Layout className="workspace">
          <Layout.Sider width="56%" theme="light" className="workspace-pane left-pane">
            <div
              className={`image-panel-shell${dragOverPanel ? " image-panel-shell--active" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                e.dataTransfer.dropEffect = "copy";
              }}
              onDragEnter={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const types = Array.from(e.dataTransfer?.types ?? []);
                if (types.includes("Files")) {
                  setDragOverPanel(true);
                }
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const next = e.relatedTarget as Node | null;
                if (!next || !e.currentTarget.contains(next)) {
                  setDragOverPanel(false);
                }
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDragOverPanel(false);
                if (isLoading) {
                  return;
                }
                const dropped = Array.from(e.dataTransfer.files ?? []);
                addImageFiles(dropped);
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="visually-hidden-input"
                disabled={isLoading}
                onChange={(event) => {
                  const list = Array.from(event.target.files ?? []);
                  addImageFiles(list);
                  event.target.value = "";
                }}
              />
              <Card title={t("imagePanel")} className="panel-card image-panel-card">
                <Space direction="vertical" size="middle" className="full-width">
                  <div>
                    <Title level={5}>{t("uploadTitle")}</Title>
                    <Text type="secondary">{t("maxImagesHint", { count: ENV.maxImages })}</Text>
                  </div>

                  <button
                    type="button"
                    className="image-panel-upload-click"
                    disabled={isLoading}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <p className="image-panel-upload-click-text">{t("uploadHint")}</p>
                  </button>

                  <div className="selected-images-panel">
                    <div className="selected-images-header">
                      <Title level={5} className="selected-images-title">
                        {t("selectedImages", { count: files.length })}
                      </Title>
                      <Button
                        type="default"
                        danger
                        size="small"
                        disabled={!files.length || isLoading}
                        onClick={clearImages}
                      >
                        {t("clearImages")}
                      </Button>
                    </div>
                    <div className="selected-images-stage">
                      {readyZipBlob && !files.length ? (
                        <div className="selected-images-zip-ready">
                          <Button
                            type="primary"
                            size="large"
                            className="submit-cta"
                            block
                            onClick={handleDownloadZip}
                          >
                            {t("downloadArchive")}
                          </Button>
                        </div>
                      ) : !files.length ? (
                        <div className="selected-images-empty">
                          <Text type="secondary">{t("noImages")}</Text>
                        </div>
                      ) : (
                        <div className="preview-grid" data-preview-rev={previewEpoch}>
                          {files.map((file, idx) => {
                            const key = fileKey(file);
                            const isExiting = exitingKeys.has(key);
                            const enterIdx = !isExiting ? staggerNewKeys.indexOf(key) : -1;
                            const wrapClass = [
                              "preview-item-wrap",
                              isExiting ? "preview-item-wrap--exit" : "",
                              enterIdx >= 0 ? "preview-item-wrap--enter" : ""
                            ]
                              .filter(Boolean)
                              .join(" ");
                            const enterStyle =
                              enterIdx >= 0
                                ? ({ ["--enter-delay"]: `${enterIdx * PREVIEW_STAGGER_MS}ms` } as CSSProperties)
                                : undefined;
                            return (
                              <div key={key} className={wrapClass} style={enterStyle}>
                                <img
                                  src={previewUrlMapRef.current.get(key) ?? ""}
                                  alt=""
                                  className="preview-item"
                                />
                                <button
                                  type="button"
                                  className="preview-item-remove"
                                  disabled={isLoading || isExiting}
                                  aria-label={t("removeImage")}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    requestRemoveAt(idx);
                                  }}
                                >
                                  ×
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </Space>
              </Card>
            </div>
          </Layout.Sider>

          <Layout.Content className="workspace-pane right-pane">
            <Card title={t("settingsPanel")} className="panel-card">
              <Form layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                  className="settings-form-item-business"
                  label={t("businessType")}
                  extra={
                    <div className="business-type-help">
                      <Paragraph type="secondary" className="business-type-help-hint">
                        {t("businessTypeHint")}
                      </Paragraph>
                      <Paragraph type="secondary" className="business-type-help-scenario">
                        {businessType ? (
                          <>
                            <Text strong>{t(`businessTypes.${businessType}`)}</Text>
                            <span className="business-type-help-sep"> — </span>
                            {t(`businessTypeScenarios.${businessType}`)}
                          </>
                        ) : (
                          t("businessTypePickHint")
                        )}
                      </Paragraph>
                    </div>
                  }
                >
                  <Select
                    value={businessType}
                    onChange={(value) => setBusinessType((value ?? "") as BusinessTypeSelection)}
                    options={[
                      { value: "", label: t("businessTypePlaceholder") },
                      ...BUSINESS_TYPES.map((type) => ({
                        value: type,
                        label: t(`businessTypes.${type}`)
                      }))
                    ]}
                    disabled={isLoading}
                  />
                </Form.Item>

                <Form.Item label={t("qualityPreset")}>
                  <Select
                    value={qualityPreset}
                    onChange={(value) => setQualityPreset(value)}
                    options={QUALITY_PRESET_OPTIONS.map((preset) => ({
                      value: preset,
                      label: t(`qualityOptions.${preset}`)
                    }))}
                    disabled={isLoading}
                  />
                </Form.Item>

                <Form.Item label={t("userInput")}>
                  <TextArea
                    rows={5}
                    placeholder={t("userInputPlaceholder")}
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    disabled={isLoading}
                  />
                </Form.Item>

                <Button
                  className="submit-cta"
                  htmlType="submit"
                  type="primary"
                  size="large"
                  block
                  loading={isLoading}
                  disabled={isLoading || !hasActiveImages || !businessType}
                >
                  {isLoading ? t("processing") : t("submit")}
                </Button>
              </Form>

              <Space className="footer-links">
                <Button type="link" className="footer-support-link" onClick={openSupportModal}>
                  {t("support")}
                </Button>
                <a href={ENV.termsUrl} target="_blank" rel="noreferrer">
                  {t("terms")}
                </a>
                <a href={ENV.privacyUrl} target="_blank" rel="noreferrer">
                  {t("privacy")}
                </a>
              </Space>

              {statusAlerts ? (
                <div className="status-alerts status-alerts--inline">{statusAlerts}</div>
              ) : null}

              <Modal
                title={t("supportModalTitle")}
                open={supportModalOpen}
                onCancel={closeSupportModal}
                footer={null}
                centered
                destroyOnClose={false}
                maskClosable
              >
                <Space direction="vertical" size="middle" className="support-modal-body">
                  <TextArea
                    value={supportDraft}
                    onChange={(e) => setSupportDraft(e.target.value)}
                    placeholder={t("supportModalPlaceholder", { max: SUPPORT_MESSAGE_MAX })}
                    maxLength={SUPPORT_MESSAGE_MAX}
                    showCount
                    rows={8}
                    className="support-modal-textarea"
                  />
                  <div className="support-modal-footer zip-success-modal-actions">
                    <Button
                      type="primary"
                      size="large"
                      className="submit-cta zip-success-modal-btn"
                      onClick={handleSupportSend}
                    >
                      {t("supportSend")}
                    </Button>
                    <Button size="large" className="zip-success-modal-btn" onClick={closeSupportModal}>
                      {t("closeModal")}
                    </Button>
                  </div>
                </Space>
              </Modal>
            </Card>
          </Layout.Content>
        </Layout>
      </main>
        </ConfigProvider>
      </div>
    </div>
  );
}

export default App;
