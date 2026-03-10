export const getAgeByDate = (date: Date) => {
    const today = new Date();
    const diff = today.getTime() - date.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}