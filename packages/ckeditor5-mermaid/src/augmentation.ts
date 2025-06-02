import type { Mermaid } from './index.js';
import MermaidEditing from './mermaidediting.js';
import MermaidToolbar from './mermaidtoolbar.js';
import MermaidUI from './mermaidui.js';

declare global {
	interface MermaidInstance {
		init(config: MermaidConfig, element: HTMLElement): void;
	}

	interface MermaidConfig {

	}

	var mermaid: Mermaid | null | undefined;
}

declare module 'ckeditor5' {
	interface PluginsMap {
		[ Mermaid.pluginName ]: Mermaid;
		[ MermaidEditing.pluginName ]: MermaidEditing;
		[ MermaidToolbar.pluginName ]: MermaidToolbar;
		[ MermaidUI.pluginName]: MermaidUI;
	}

	interface EditorConfig {
		"mermaid"?: {
			lazyLoad?: () => Promise<MermaidInstance> | MermaidInstance;
			config: MermaidConfig;
		}
	}

}

