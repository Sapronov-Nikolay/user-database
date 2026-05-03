// ===========================================================================
// ФАЙЛ: statistics.js
// НАЗНАЧЕНИЕ: Расчёт статистики по пользователям.
// ===========================================================================

/**
  Находит самого молодого и самого старшего пользователя.
  @returns {object} - Объект с результатами.
*/
function findYoungestAndOldest() {
  // ШАГ 1: Если данных нет - возвращаем пустую структуру.
  if (!usersData || usersData.length === 0) {
    return {
      youngestUsers: [],
      oldestUsers: [],
      youngestDetailedAge: {
        years: 0,
        months: 0,
        days: 0
      },
      oldestDetailedAge: {
        years: 0,
        months: 0,
        days: 0
      }
    };
  }

  // ШАГ 2: Превращаем возраст каждого пользователя в количество месяцев.
  const usersWithAge = usersData.map(user => {
    const detailedAge = calculateAgeDetailed(user.birthDate);
    const ageInMonths = detailedAge.years * 12 + detailedAge.months;
    return { ...user, ageInMonths, detailedAge};
  });

  // ШАГ 3: Сортируем по возрастанию возраста в месяцах.
  const sortedByAge = [...usersWithAge].sort((a, b) => a.ageInMonths - b.ageInMonths);

  // ШАГ 4: Самый молодой- первый элемент.
  const youngestAge = sortedByAge[0].ageInMonths;
  const youngestUsers = sortedByAge.filter(u => u.ageInMonths === youngestAge);

  // ШАГ 5: Самый старший - последний элемент.
  const oldestAge = sortedByAge[sortedByAge.length - 1].ageInMonths;
  const oldestUsers = sortedByAge.filter(u => u.ageInMonths === oldestAge);

  // ШАГ 6: Возвращаем результат.
  return {
    youngestUsers: youngestUsers.map(u => ({
      name: u.name,
      detailedAge: u.detailedAge
    })),
    oldestUsers: oldestUsers.map(u => ({
      name: u.name,
      detailedAge: u.detailedAge
    })),
    youngestDetailedAge: youngestUsers[0]?.detailedAge || {
      years: 0,
      months: 0,
      days: 0
    },
    oldestDetailedAge: oldestUsers[0]?.detailedAge || {
      years: 0,
      months: 0,
      days: 0
    }
  };
}

/**
  Формирует средний возраст (в месяцах) в читаемую строку.
  @param {number} months - Возраст в месяцах (может быть дробным).
  @returns {string} - Отформатированная строка.
*/
function formatAverageAge(months) {
  // СЛУЧАЙ 1: Возраст меньше 1-го месяца.
  if (months < 1) {
    const days = Math.round(months * 30.44);
    return `${days} ${getWordForm(days, "day")}`;
  }

  // СЛУЧАЙ 2: Возраст меньше 1 года (1-11 месяца).
  else if (months < 12) {
    const fullMonths = Meth.floor(months);
    const remainingDays = Math.round((months - fullMonths) * 30.44);
    if (remainingDays === 0) {
      return `${fullMonths} ${getWordForm(fullMonths, "month")}`;
    } else {
      return `${fullMonths} ${getWordForm(fullMonths, "month")} и ${remainingDays} ${getWordForm(remainingDays, "day")}`;
    }
  }

  // СЛУЧАЙ 3: возраст от 1-го года и выше.
  else {
    const years = Math.floor(months / 12);
    const remainingMonths = Math.round(months % 12);
    if (remainingMonths === 0) {
      return `${getWordForm(years, "year")}`;
    } else {
      return `${years} ${getWordForm(years, "year")} и ${remainingMonths} ${getWordForm(remainingMonths, "month")}`;
    }
  }
}