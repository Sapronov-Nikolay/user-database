// ===========================================================================
// ФАЙЛ: app.js
// НАЗНАЧЕНИЕ: Точка входа в приложение.
//            Инициализирует UI, запускает проверки,
//            подключает обработчики событий.
// ===========================================================================

// Ждём полной загрузки HTML-документа
document.addEventListener('DOMContentLoaded', function() {
  console.log('✅ HTML загружен, начинаем инициализацию');
  // --- 1. Проверка наличия данных ---
  if (typeof usersData === 'undefined') {
    console.error('❌ usersData не определёна! проверьте data.js');
    return;
  }

  // --- 2. проверка уникальности email в исходных данных ---
  // validateUniqueEmails определена в historical/emails.js
  if (!validateUniqueEmails(usersData)) {
    console.warn('⚠️ В данных найдены дубликаты email. Рекомендуется исправить data.js');
    // Можно остановить дальнейшуюзагрузку, если нужно:
    // return;
  }

  // --- 3. Инициализация интерфейса (поиск кнопок и контейнера) ---
  if (!initUI()) {
    console.error('❌ Не удалось инициализировать UI');
    return;
  }

  // --- 4. Создание кнопки "Сбросить" ---
  createResetButton();

  // --- 5: Назначение обработчика на главную кнопку ---
  const loadBtn = document.getElementById('load-data');
  loadBtn.addEventListener('click', function() {
    console.log('🎯 Кнопка "Загрузить данные" нажата');
    displayUsers();
  });
  console.log('🎉 Приложение готово к работе');
});