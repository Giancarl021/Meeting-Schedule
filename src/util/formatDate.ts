function padNumber(n: number, padding: number = 2): string {
    return n.toString().padStart(padding, '0');
}

export default function formatDate(date: Date): string {
    return `${padNumber(date.getFullYear(), 4)}-${padNumber(date.getMonth() + 1)}-${padNumber(date.getDate())}`;
}
