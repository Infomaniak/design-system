import libCoverage, { CoverageMap } from 'istanbul-lib-coverage';
import { Instrumenter } from 'istanbul-lib-instrument';
import { ProxifiedModule } from 'magicast';
import { ResolvedCoverageOptions, CoverageProvider, Vitest, Vite, ReportContext } from 'vitest/node';
import { BaseCoverageProvider } from 'vitest/coverage';

declare class IstanbulCoverageProvider extends BaseCoverageProvider<ResolvedCoverageOptions<"istanbul">> implements CoverageProvider {
	name: "istanbul";
	version: string;
	instrumenter: Instrumenter;
	private transformedModuleIds;
	initialize(ctx: Vitest): void;
	requiresTransform(id: string): boolean;
	onFileTransform(sourceCode: string, id: string, pluginCtx: Vite.Rollup.TransformPluginContext): {
		code: string;
		map: any;
	} | undefined;
	createCoverageMap(): libCoverage.CoverageMap;
	generateCoverage({ allTestsRun }: ReportContext): Promise<CoverageMap>;
	generateReports(coverageMap: CoverageMap, allTestsRun: boolean | undefined): Promise<void>;
	parseConfigModule(configFilePath: string): Promise<ProxifiedModule<any>>;
	private getCoverageMapForUncoveredFiles;
	onEnabled(): void;
	private invalidateTree;
}

export { IstanbulCoverageProvider };
