import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      appTitle: "TasteFrame",
      appDescription: "Food image enhancement workspace",
      language: "Language",
      imagePanel: "Images",
      settingsPanel: "Settings",
      uploadTitle: "Upload food images",
      uploadHint: "Drag and drop images here, or click to choose files",
      selectedImages: "Selected images ({{count}})",
      noImages: "No images selected yet",
      maxImagesHint: "Up to {{count}} images",
      clearImages: "Remove all",
      removeImage: "Remove image",
      businessType: "Business type",
      businessTypePlaceholder: "Select business type",
      businessTypePickHint: "Choose a business type before enhancing — the style description will appear here.",
      businessTypeHint:
        "This does not detect what's in your image — it sets the retouch style (lighting, contrast, mood). Choose the option closest to where you'll use the image; refine with additional instructions below.",
      businessTypeScenarios: {
        restaurant: "Elegant lighting and refined tones — premium menu and dining-room feel.",
        cafe: "Warm palette and soft shadows — cozy café mood.",
        fastfood: "Bold colors and high contrast — eye-catching on menus and screens.",
        delivery: "Crisp and readable at small sizes — suited for apps and delivery listings.",
        bakery: "Soft light and gentle highlights — creamy textures and pastry appeal.",
        realtorHouse: "Natural light and curb appeal — houses and townhouses on listings.",
        realtorApartment:
          "Natural light and true-to-life colors — preserves ceiling, outlets, and floor; exposure only."
      },
      qualityPreset: "Quality",
      qualityOptions: {
        low: "Low (fast)",
        medium: "Medium",
        high: "High (best quality)"
      },
      userInput: "Additional instructions (optional)",
      userInputPlaceholder:
        "For example: add warmer tones, soft shadows, and texture emphasis",
      submit: "Enhance image",
      processing: "Processing...",
      support: "Support",
      terms: "Terms",
      privacy: "Privacy",
      supportModalTitle: "Support",
      supportModalPlaceholder: "Describe your question or issue (up to {{max}} characters).",
      supportSend: "Send",
      supportMessageSent: "Message sent.",
      success:
        "Done. Your enhanced images are ready — download the ZIP from the Images panel on the left.",
      downloadArchive: "Download ZIP archive",
      closeModal: "Close",
      errors: {
        maxImages: "You can upload up to {{count}} images",
        panelFull: "You already have {{max}} images. Remove some to add more.",
        someNotAdded: "{{skipped}} image(s) were not added (maximum {{max}}).",
        allDuplicates: "These images are already in the list.",
        noImages: "Please add at least one image",
        businessTypeRequired: "Please select a business type before enhancing.",
        generic: "Processing failed"
      },
      businessTypes: {
        restaurant: "Restaurant",
        cafe: "Cafe",
        fastfood: "Fast food",
        delivery: "Delivery",
        bakery: "Bakery",
        realtorHouse: "Real estate: houses",
        realtorApartment: "Real estate: apartments"
      }
    }
  },
  ru: {
    translation: {
      appTitle: "TasteFrame",
      appDescription: "Рабочее пространство для улучшения изображений блюд",
      language: "Язык",
      imagePanel: "Изображения",
      settingsPanel: "Настройки",
      uploadTitle: "Загрузка изображений блюд",
      uploadHint: "Перетащите изображения сюда или нажмите для выбора",
      selectedImages: "Выбранные изображения ({{count}})",
      noImages: "Изображения пока не выбраны",
      maxImagesHint: "До {{count}} изображений",
      clearImages: "Удалить все",
      removeImage: "Удалить изображение",
      businessType: "Тип бизнеса",
      businessTypePlaceholder: "Выберите тип бизнеса",
      businessTypePickHint: "Перед улучшением выберите тип бизнеса — здесь появится описание стиля.",
      businessTypeHint:
        "Это не распознавание содержимого изображения — задаётся стиль обработки (свет, контраст, настроение). Выберите вариант, ближе к тому, где будете использовать снимок; детали можно уточнить в поле ниже.",
      businessTypeScenarios: {
        restaurant: "Элегантный свет и сдержанные тона — премиальное меню и зал.",
        cafe: "Тёплая палитра и мягкие тени — уютное настроение кафе.",
        fastfood: "Яркие цвета и высокий контраст — заметно в меню и на экранах.",
        delivery: "Чёткость и читаемость в мелком масштабе — приложения и карточки блюд.",
        bakery: "Мягкий свет и нежные блики — текстуры выпечки и десертов.",
        realtorHouse: "Дневной свет и презентабельный вид — дома и таунхаусы в объявлениях.",
        realtorApartment:
          "Естественный свет и правдивые цвета — сохраняются потолок, розетки и пол; только экспозиция."
      },
      qualityPreset: "Качество",
      qualityOptions: {
        low: "Низкое (быстрее)",
        medium: "Среднее",
        high: "Высокое (лучшее качество)"
      },
      userInput: "Доп. пожелания (опционально)",
      userInputPlaceholder:
        "Например: добавить более теплый тон, мягкие тени и акцент на текстуре",
      submit: "Улучшить изображение",
      processing: "Обрабатываем...",
      support: "Поддержка",
      terms: "Условия",
      privacy: "Конфиденциальность",
      supportModalTitle: "Поддержка",
      supportModalPlaceholder: "Опишите вопрос или проблему (до {{max}} символов).",
      supportSend: "Отправить",
      supportMessageSent: "Сообщение отправлено.",
      success:
        "Готово. Улучшенные изображения собраны в архив — скачайте ZIP в панели «Изображения» слева.",
      downloadArchive: "Скачать ZIP-архив",
      closeModal: "Закрыть",
      errors: {
        maxImages: "Можно загрузить максимум {{count}} изображений",
        panelFull: "Уже выбрано {{max}} изображений. Удалите часть, чтобы добавить ещё.",
        someNotAdded: "{{skipped}} изображений не добавлено (максимум {{max}}).",
        allDuplicates: "Эти изображения уже в списке.",
        noImages: "Добавьте хотя бы одно изображение",
        businessTypeRequired: "Перед улучшением выберите тип бизнеса.",
        generic: "Ошибка обработки"
      },
      businessTypes: {
        restaurant: "Ресторан",
        cafe: "Кафе",
        fastfood: "Фастфуд",
        delivery: "Доставка",
        bakery: "Пекарня",
        realtorHouse: "Недвижимость: дома",
        realtorApartment: "Недвижимость: квартиры"
      }
    }
  },
  fr: {
    translation: {
      appTitle: "TasteFrame",
      appDescription: "Espace de travail pour ameliorer les images culinaires",
      language: "Langue",
      imagePanel: "Images",
      settingsPanel: "Parametres",
      uploadTitle: "Importer des images culinaires",
      uploadHint: "Glissez-deposez des images ici, ou cliquez pour selectionner",
      selectedImages: "Images selectionnees ({{count}})",
      noImages: "Aucune image selectionnee",
      maxImagesHint: "Jusqu'a {{count}} images",
      clearImages: "Tout retirer",
      removeImage: "Retirer l'image",
      businessType: "Type d'activite",
      businessTypePlaceholder: "Choisir le type d'activite",
      businessTypePickHint: "Choisissez un type d'activite avant d'ameliorer — la description du style s'affichera ici.",
      businessTypeHint:
        "Ce choix n'analyse pas le contenu de l'image — il oriente le style de retouche (lumiere, contraste, ambiance). Choisissez l'usage le plus proche du votre; affinez avec les instructions ci-dessous.",
      businessTypeScenarios: {
        restaurant: "Lumiere elegante et tons raffines — carte et salle haut de gamme.",
        cafe: "Palette chaude et ombres douces — ambiance cafe accueillante.",
        fastfood: "Couleurs vives et contraste marque — menus et ecrans.",
        delivery: "Net et lisible en petit format — apps et fiches plats.",
        bakery: "Lumiere douce et textures delicates — patisserie et viennoiseries.",
        realtorHouse: "Lumiere naturelle et rendu premium — maisons et townhouses sur annonces.",
        realtorApartment:
          "Lumiere naturelle et couleurs fideles — plafond, prises et sol inchanges; exposition seulement."
      },
      qualityPreset: "Qualite",
      qualityOptions: {
        low: "Faible (plus rapide)",
        medium: "Moyenne",
        high: "Elevee (meilleure qualite)"
      },
      userInput: "Instructions supplementaires (optionnel)",
      userInputPlaceholder:
        "Par exemple: tons plus chauds, ombres douces, texture plus nette",
      submit: "Améliorer l'image",
      processing: "Traitement...",
      support: "Support",
      terms: "Conditions",
      privacy: "Confidentialite",
      supportModalTitle: "Support",
      supportModalPlaceholder: "Decrivez votre question ou probleme (jusqu'a {{max}} caracteres).",
      supportSend: "Envoyer",
      supportMessageSent: "Message envoye.",
      success:
        "Termine. Vos images sont pretes — telechargez le ZIP dans le panneau Images a gauche.",
      downloadArchive: "Telecharger l'archive ZIP",
      closeModal: "Fermer",
      errors: {
        maxImages: "Vous pouvez importer jusqu'a {{count}} images",
        panelFull: "Vous avez deja {{max}} images. Retirez-en pour en ajouter.",
        someNotAdded: "{{skipped}} image(s) non ajoutees (maximum {{max}}).",
        allDuplicates: "Ces images sont deja dans la liste.",
        noImages: "Ajoutez au moins une image",
        businessTypeRequired: "Selectionnez un type d'activite avant d'ameliorer.",
        generic: "Echec du traitement"
      },
      businessTypes: {
        restaurant: "Restaurant",
        cafe: "Cafe",
        fastfood: "Restauration rapide",
        delivery: "Livraison",
        bakery: "Boulangerie",
        realtorHouse: "Immobilier : maisons",
        realtorApartment: "Immobilier : appartements"
      }
    }
  },
  ua: {
    translation: {
      appTitle: "TasteFrame",
      appDescription: "Робочий простiр для покращення зображень страв",
      language: "Мова",
      imagePanel: "Зображення",
      settingsPanel: "Налаштування",
      uploadTitle: "Завантаження зображень страв",
      uploadHint: "Перетягнiть зображення сюди або натиснiть для вибору",
      selectedImages: "Вибранi зображення ({{count}})",
      noImages: "Зображення ще не вибрано",
      maxImagesHint: "До {{count}} зображень",
      clearImages: "Прибрати всi",
      removeImage: "Прибрати зображення",
      businessType: "Тип бiзнесу",
      businessTypePlaceholder: "Оберіть тип бiзнесу",
      businessTypePickHint: "Перед покращенням оберіть тип бiзнесу — тут з’явиться опис стилю.",
      businessTypeHint:
        "Це не аналiз вмiсту зображення — задається стиль обробки (свiтло, контраст, настрій). Оберіть варiант, найближчий до того, де покажете знимок; уточнення — у полi нижче.",
      businessTypeScenarios: {
        restaurant: "Витончене свiтло та стриманi тони — премiальне меню i зал.",
        cafe: "Тепла палiтра та м'якi тiнi — затишна атмосфера кав'ярнi.",
        fastfood: "Яскравi кольори та високий контраст — помiтно в меню i на екранах.",
        delivery: "Чiткiсть у дрiбному масштабi — додатки та картки страв.",
        bakery: "М'яке свiтло та нiжнi блики — текстури випiчки i десертiв.",
        realtorHouse: "Денне свiтло та презентабельний вигляд — будинки та таунхауси в оголошеннях.",
        realtorApartment:
          "Природне свiтло та правдивi кольори — стеля, розетки й підлога без змін; лише експозиція."
      },
      qualityPreset: "Якiсть",
      qualityOptions: {
        low: "Низька (швидше)",
        medium: "Середня",
        high: "Висока (краща якiсть)"
      },
      userInput: "Додатковi побажання (опцiйно)",
      userInputPlaceholder:
        "Наприклад: теплiший тон, м'якi тiнi та акцент на текстурi",
      submit: "Покращити зображення",
      processing: "Обробка...",
      support: "Пiдтримка",
      terms: "Умови",
      privacy: "Конфiденцiйнiсть",
      supportModalTitle: "Пiдтримка",
      supportModalPlaceholder: "Опишiть питання або проблему (до {{max}} символiв).",
      supportSend: "Надiслати",
      supportMessageSent: "Повiдомлення надiслано.",
      success:
        "Готово. Покращенi зображення зiбранi в архiв — завантажте ZIP у панелi «Зображення» злiва.",
      downloadArchive: "Завантажити ZIP-архiв",
      closeModal: "Закрити",
      errors: {
        maxImages: "Можна завантажити максимум {{count}} зображень",
        panelFull: "Вже вибрано {{max}} зображень. Прибери частину, щоб додати ще.",
        someNotAdded: "{{skipped}} зображень не додано (максимум {{max}}).",
        allDuplicates: "Цi зображення вже у списку.",
        noImages: "Додайте хоча б одне зображення",
        businessTypeRequired: "Перед покращенням оберіть тип бiзнесу.",
        generic: "Помилка обробки"
      },
      businessTypes: {
        restaurant: "Ресторан",
        cafe: "Кафе",
        fastfood: "Фастфуд",
        delivery: "Доставка",
        bakery: "Пекарня",
        realtorHouse: "Нерухомiсть: будинки",
        realtorApartment: "Нерухомiсть: квартири"
      }
    }
  },
  de: {
    translation: {
      appTitle: "TasteFrame",
      appDescription: "Arbeitsbereich zur Optimierung von Food-Bildern",
      language: "Sprache",
      imagePanel: "Bilder",
      settingsPanel: "Einstellungen",
      uploadTitle: "Food-Bilder hochladen",
      uploadHint: "Bilder hierher ziehen oder zum Auswaehlen klicken",
      selectedImages: "Ausgewaehlte Bilder ({{count}})",
      noImages: "Noch keine Bilder ausgewaehlt",
      maxImagesHint: "Bis zu {{count}} Bilder",
      clearImages: "Alle entfernen",
      removeImage: "Bild entfernen",
      businessType: "Geschaeftstyp",
      businessTypePlaceholder: "Geschaeftstyp waehlen",
      businessTypePickHint: "Waehlen Sie vor der Optimierung einen Geschaeftstyp — hier erscheint die Stilbeschreibung.",
      businessTypeHint:
        "Damit wird nicht erkannt, was auf dem Bild ist — es steuert den Retusche-Stil (Licht, Kontrast, Stimmung). Waehlen Sie den passendsten Verwendungszweck; Details unten in den Hinweisen.",
      businessTypeScenarios: {
        restaurant: "Elegantes Licht und ruhige Toene — Premium-Speisekarte und Gastraum.",
        cafe: "Warme Farben und weiche Schatten — gemuetliches Cafe.",
        fastfood: "Kräftige Farben und hoher Kontrast — Speisekarten und Displays.",
        delivery: "Knackig und gut lesbar klein — Apps und Lieferportale.",
        bakery: "Weiches Licht und zarte Highlights — Backwaren und Desserts.",
        realtorHouse: "Tageslicht und attraktive Praesentation — Einfamilien- und Reihenhaeuser.",
        realtorApartment:
          "Natuerliches Licht und getreue Farben — Decke, Steckdosen und Boden unveraendert; nur Belichtung."
      },
      qualityPreset: "Qualitaet",
      qualityOptions: {
        low: "Niedrig (schneller)",
        medium: "Mittel",
        high: "Hoch (beste Qualitaet)"
      },
      userInput: "Zusaetzliche Hinweise (optional)",
      userInputPlaceholder:
        "Zum Beispiel: waermere Toene, weiche Schatten, mehr Textur",
      submit: "Bild verbessern",
      processing: "Verarbeitung...",
      support: "Support",
      terms: "AGB",
      privacy: "Datenschutz",
      supportModalTitle: "Support",
      supportModalPlaceholder: "Beschreiben Sie Ihr Anliegen (bis zu {{max}} Zeichen).",
      supportSend: "Senden",
      supportMessageSent: "Nachricht gesendet.",
      success:
        "Fertig. Ihre Bilder sind bereit — laden Sie das ZIP im linken Bereich «Bilder» herunter.",
      downloadArchive: "ZIP-Archiv herunterladen",
      closeModal: "Schliessen",
      errors: {
        maxImages: "Sie koennen bis zu {{count}} Bilder hochladen",
        panelFull: "Bereits {{max}} Bilder ausgewaehlt. Entfernen Sie welche, um mehr hinzuzufuegen.",
        someNotAdded: "{{skipped}} Bild(er) nicht hinzugefuegt (Maximum {{max}}).",
        allDuplicates: "Diese Bilder sind bereits in der Liste.",
        noImages: "Bitte mindestens ein Bild hinzufuegen",
        businessTypeRequired: "Bitte waehlen Sie vor der Optimierung einen Geschaeftstyp.",
        generic: "Verarbeitung fehlgeschlagen"
      },
      businessTypes: {
        restaurant: "Restaurant",
        cafe: "Café",
        fastfood: "Fast Food",
        delivery: "Lieferdienst",
        bakery: "Baeckerei",
        realtorHouse: "Immobilien: Haeuser",
        realtorApartment: "Immobilien: Wohnungen"
      }
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
