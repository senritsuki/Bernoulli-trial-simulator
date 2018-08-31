export class XORShift {

    public n: number;

    constructor(
        public seed: number,
        public shift1: number = 13,
        public shift2: number = 17,
        public shift3: number = 15,
    ) {
        this.n = seed;
    }

    random(): number {
        let n = this.n;
        n = n ^ (n << this.shift1);
        n = n ^ (n >>> this.shift2);
        n = n ^ (n << this.shift3);
        this.n = n;
        return (n / (1 << 31) + 1) / 2;
    }
}

export function exec(random: () => number, probability: number, num: number): number {
    let success = 0;
    for (let i = 0; i < num; i++) {
        if (random() < probability) {
            success++;
        }
    }
    return success;
}

export function exec_with_distribution(random: () => number, probability: number, distribution: number[]): number[] {
    const results = distribution.map((num, i) => trial(random, probability, num, i));
    const new_distribution = merge(results);
    return new_distribution;
}

interface IF {
    count: number;
    failure: number;
    success: number;
}

function trial(random: () => number, probability: number, people_num: number, count: number): IF {
    const success = exec(random, probability, people_num);
    return {
        count: count,
        failure: people_num - success,
        success: success,
    }
}

function merge(results: IF[]): number[] {
    let count_people: number[] = [];
    for (let i = 0; i < results.length + 1; i++) {
        count_people[i] = 0;
    }
    results.forEach(r => {
        count_people[r.count] += r.failure;
        count_people[r.count+1] += r.success;
    });
    if (count_people[count_people.length - 1] == 0) {
        count_people = count_people.slice(0, count_people.length - 1);
    }
    return count_people;
}

export function sumTotal(count_people: number[]): number {
    const total = count_people
        .map((n, i) => n * i)
        .reduce((a, b) => a + b);
    return total;
}

export function countIfLessThan(count_people: number[], lessThan: number): number {
    const total = count_people
        .map((n, i) => i < lessThan ? n : 0)
        .reduce((a, b) => a + b);
    return total;
}
