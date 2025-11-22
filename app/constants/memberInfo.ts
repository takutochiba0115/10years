export type MemberInfo = {
    id: number;
    name: string;
    image: string;
}

const memberInfoData = Array.from({ length: 12 }, (_, index) => ({
    name: `Member ${index + 1}`,
    image: '/coming-soon.jpg',
}));

export const memberInfo: MemberInfo[] = memberInfoData.map((member, index) => ({
    id: index + 1,
    ...member,
}));

