// ===========================================================================
// ФАЙЛ: ui.js
// НАЗНАЧЕНИЕ: Вся работа с интерфейсом.
//            Создаёт карточки пользователей, статистику, управляет кнопками.
// ===========================================================================

// Глобальные переменные для хранения ссылок на DOM-элементы
let loadButton;
let outputContainer;

/**
  Инициализация: находим кнопку "Загрузить данные" и контейнер для вывода.
  Вызывается один раз при старте.
  @param {boolean} - true, если все элементы найдены.
*/
function initUI() {
  // ШАГ 1: Получаем кнопку по ID
  loadButton = document.getElementById('load-data');
  // ШАГ 2: Получаем контейнер для карточек
  outputContainer = document.getElementById('output');

  // ШАГ 3: Если что-то не найдено - ошибка, дальше работать нельзя
  if (!loadButton || !outputContainer) {
    console.error('❌ initUI: Не найдены load-data или output');
    return false;
  }
  // Если всё хорошо, то работаем
  return true;
}

/**
  ГЛАВНАЯ ФУНКЦИЯ ОТОБРАЖЕНИЯ.
  Отрисовывает список пользователей и статистику.
*/
function displayUsers() {
  console.log('🎯 displayUsers вызвана');

  // --- 1. Очистка контейнера ---
  outputContainer.innerHTML = '';
  // --- 2. Заголовок с количеством пользователей ---
  const title = document.createElement('h2');
  // getWordForm склоняет слово "пользователей"
  title.textContent = `${appTitle} (всего: ${usersData.length} ${getWordForm(usersData.length, "user")})`;
  outputContainer.appendChild(title);

  // --- 3. Создание карточки для каждого пользователя ---
  usersData.forEach((user, index) => {
    // 3.1. Очищаем пользователя (приводим к эпохе)
    const viewUser = cleanHistoricalData(user);
    console.log(`  ${index+1}: ${user.surname} ${user.name}`);
    
    // 3.2. Создаём DOM-элемент карточки
    const card = document.createElement('div');
    card.className = 'user-card';
    card.setAttribute('data-user-id', user.id);

    // 3.3. Заполняем HTML
    card.innerHTML = `
      <div class="user-card-header">
        <h3 class="user-badge">${user.surname} ${user.name} ${user.patronymic}</h3>
        <span class="user-badge">ID: ${user.id}</span>
      </div>
      <div class="user-card-body">
        <p><strong>Эмейл: </strong>${viewUser.email === "нет" ? "отсутствует" : viewUser.email}</p>
        <p><strong>Телефон: </strong>${viewUser.phone === "нет" ? "отсутствует" : viewUser.phone}</p>
        <p><strong>Дата рождения: </strong>${formatDate(viewUser.birthDate)}</p>
          <!-- Возраст с учётом даты смерти (глагол "прожил/прожила") -->
        <p><strong>Возраст: </strong>${getAgeStrungForUser(viewUser)}</p>
          <!-- Подробный возраст (годы, месяцы, дни) -->
        <p><strong>Полный возраст: </strong>${getAgeStrungFull(user.birthDate)}</p>
        <p><strong>Город: </strong>${user.city}</p>
        <p><strong>Профессия: </strong>${viewUser.profession === "нет" ? "отсутствует" : viewUser.profession}</p>
        <p><strong>Статус: </strong>${viewUser.lifeStatusText}</p>
          <!-- Кликабельная эпоха -->
        <p><strong>Эпоха: </strong><span class="period-link"
                                    style="cursor:pointer;color:#3498db;text-decoration:underline;"
                                    data-period="${viewUser.historicalPeriod}">${viewUser.historicalPeriod}</span></p>
      </div>
      <div class="user-card-footer">
        <button class="details-btn" data-id="${viewUser.id}">Подробнее</button>
      </div>
    `;
    // Запускаем отрисовку
    outputContainer.appendChild(card);
  });

  // --- 4. Блок статистики ---
  const statsDiv = document.createElement('div');
  statsDiv.className = 'stats';

  // Получаем самых молодых/старших из statistics.js
  const {youngestUsers, oldestUsers, youngestDetailedAge, oldestDetailedAge} = findYoungestAndOldest();

  // Рассчитываем средний возраст в месяцах (для formatAverageAge)
  const detailedAges = usersData.map(u => calculateAgeDetailed(u.birthDate));
  const totalMonths = detailedAges.reduce((sum, age) => sum + age.years * 12 + age.months + age.days / 30.44, 0);
  const avgMonths = usersData.length ? totalMonths / usersData.length : 0;

  // Отрисовываем карточку статистики с горовыми вычисленными данными
  statsDiv.innerHTML = `
    <h4>📈 Статистика (рассчитано на ${new Date().toLocaleDateString('ru-RU')})</h4>
    <p><strong>Общее количество:</strong> ${usersData.length} ${getWordForm(usersData.length, "user")}</p>
    <p><strong>Средний возраст:</strong> ${formatAverageAge(avgMonths)}</p>
    <p><strong>Самый молодой:</strong> ${formatDetailedAge(youngestDetailedAge)} (${youngestUsers.map(u => u.name).join(', ')})</p>
    <p><strong>Самый старший:</strong> ${formatDetailedAge(oldestDetailedAge)} (${oldestUsers.map(u => u.name).join(', ')})</p>
  `;
  // Запускаем отрисовку
  outputContainer.appendChild(statsDiv);

  // --- 5. Назначаем обработчики на кнопку "Подробнее" ---
  document.querySelectorAll('.details-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const userId = this.getAttribute('data-id');
      const user = usersData.find(u => u.id == userId);
      if (user) {
        // Если указан пользователь, используем корректные функции из дат
        const ageShort = getAgeStrung(user.birthDate);
        const ageFill = getAgeStrungFull(user.birthDate);
        alert(`
          Подробная информация:
          \n\nИмя: ${user.surname} ${user.name} ${user.patronymic}
          \nЭмейл: ${user.email}
          \nТелефон: ${user.phone}
          \nДата рождения: ${formatDate(user.birthDate)}
          \nВозраст: ${ageShort}
          \nПолный возраст: ${ageFill}
          \nГород: ${user.city}
          \nПрофиссия: ${user.profession}
        `);
      }
    });
  });

  // --- 6. Обработчики для кликабельных эпох ---
  document.querySelectorAll('.period-link').forEach(link => {
    link.addEventListener('click', function() {
      showPeriodDescription(this.getAttribute('data-period'));
    });
  });

  // --- 7. Меняем состояние кнопки "Загрузить данные" ---
  loadButton.textContent = '✅ Данные загружены';
  loadButton.disabled = true;
  loadButton.style.background = '#95a5a6';
  console.log('✅ Данные отображены');
}

/**
  Сбрасываем отображение к исходному состоянию
*/
function resetDisplay() {
  console.log('🔄 Сброс отображения');
  // Возвращаем начальное сообщение
  outputContainer.innerHTML = `
    <div style="text-align:center;padding:40px;color:#7f8c8d;">
      <p>Данные не загружены</p>
      <p>Нажмите "Загрузить данные", чтобы отобразить информацию</p>
    </div>
  `;
  // Восстанавливаем кнопку "Загрузить данные"
  loadButton.textContent = 'Загрузить данные';
  loadButton.disabled = false;
  loadButton.style.background = '#3498db';
}

/**
  Создаёт кнопку "Сбросить" и добавляет её на страницу
*/
function createResetButton() {
  const resetBtn = document.createElement('button');
  resetBtn.textContent = 'Сбросить';
  resetBtn.id = 'reset-btn';
  resetBtn.style.marginLeft = '10px';
  resetBtn.style.backgroundColor = '#e74c3c';
  // Вставляем кнопку перед контейнером output
  outputContainer.parentNode.insertBefore(resetBtn, outputContainer);
  // Навешиваем обработчик сброса
  resetBtn.addEventListener('click', resetDisplay);
}