import { DcfTool } from "@/components/tools/dcf-tool";
import { OptionsTool } from "@/components/tools/options-tool";

/**
 * Maps a project's `toolKey` to the component mounted on its detail page.
 * Add a new interactive project by adding a component and one line here.
 */
export const toolRegistry: Record<string, React.ComponentType> = {
  dcf: DcfTool,
  options: OptionsTool,
};

export function getTool(key?: string) {
  return key ? toolRegistry[key] : undefined;
}
