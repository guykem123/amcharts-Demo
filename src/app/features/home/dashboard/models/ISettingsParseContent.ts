

export interface ISettingsParseContent {
    setting: { X: number, Y: number; },
    supportedGranularities?: any[],
    advancedOptions: boolean,
    groupBySecondary?: number;
}