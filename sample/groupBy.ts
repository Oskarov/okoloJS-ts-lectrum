export const groupBy = <T>(arr: T[], cb: (el: T) => string | number): { [p: string]: T[] } => {

    let result: { [n: string]: T[] } = {}

    for (let item of arr) {
        const computed = cb(item) as string;
        if (result.hasOwnProperty(computed)) {
            result[computed].push(item)
        } else {
            result[computed] = [item]
        }
    }

    return result;
};

console.log(groupBy([1.2, 1.1, 1.5, 0.3, 2.3, 0.4], Math.floor));