export type HistoryEvent = {
    id: number;
    year: number;
    title: string;
    description: string;
    image?: string;
};

export const historyData: HistoryEvent[] = [
    {
        id: 1,
        year: 2010,
        title: '会社設立',
        description: '新しい未来を創造するために、私たちの旅が始まりました。',
        image: '/coming-soon.jpg',
    },
    {
        id: 2,
        year: 2012,
        title: '初の製品リリース',
        description: '革新的な製品で市場に参入し、業界に新しい風を吹き込みました。',
        image: '/coming-soon.jpg',
    },
    {
        id: 3,
        year: 2014,
        title: 'グローバル展開',
        description: '海外市場への進出を果たし、国際的な企業へと成長しました。',
        image: '/coming-soon.jpg',
    },
    {
        id: 4,
        year: 2016,
        title: '新オフィス開設',
        description: '事業拡大に伴い、最先端の設備を備えた新オフィスを開設しました。',
        image: '/coming-soon.jpg',
    },
    {
        id: 5,
        year: 2018,
        title: '技術革新賞受賞',
        description: '業界をリードする技術力が認められ、数々の賞を受賞しました。',
        image: '/coming-soon.jpg',
    },
    {
        id: 6,
        year: 2020,
        title: '10周年記念',
        description: '創立10周年を迎え、新たなビジョンとともに次の10年へ。',
        image: '/coming-soon.jpg',
    },
];

