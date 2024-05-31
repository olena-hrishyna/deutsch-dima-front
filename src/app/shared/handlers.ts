function isNotEmpty(value: any): boolean {
  return (
    value !== null &&
    value !== undefined &&
    value !== '' &&
    !Number.isNaN(value)
  );
}

export function removeEmptyValueFromArrey(arr: any[]): any[] {
  return arr.filter(isNotEmpty);
}

export function removeEmptyValueFromObject(obj: Record<string, any>) {
  for (var key in obj) {
      if (obj.hasOwnProperty(key) && (obj[key] === null || obj[key] === undefined || obj[key] === '')) {
          delete obj[key];
      }
  }
  return obj;
}

export function saveLocalStorage(key: string, item: any): void {
  localStorage.setItem(key, JSON.stringify(item));
}

export function deleteLocalStorage(key: string): void {
  localStorage.removeItem(key);
}

export function getLocalStorage(key: string): any {
  try {
    return JSON.parse(localStorage.getItem(key) || '');
  } catch (err) {
    return null;
  }
}

export function isGermanAlphabetLetter(character: string) {
  // Регулярное выражение для букв немецкого алфавита
  var deRegex = /^[a-zA-ZäöüßÄÖÜ]$/;

  return deRegex.test(character);
}

// Функция для перемешивания массива объектов
export const mixArray = <T>(array: T[]): T[] => {
  const mixedArray = [...array];

  for (let i = mixedArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [mixedArray[i], mixedArray[j]] = [mixedArray[j], mixedArray[i]];
  }

  return mixedArray;
};

export const getRandomIndex = <T>(array: T[]): number => {
  return Math.floor(Math.random() * array.length);
};

export const uniqueArray  = <T>(array: T[]): T[] => {
  return [...new Set(array)];
};
