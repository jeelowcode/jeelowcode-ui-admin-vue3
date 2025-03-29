import type { DefineComponent } from 'vue';
interface ComponentModule {
  default: DefineComponent<{}, {}, any>;
}
const modules = import.meta.glob<ComponentModule>('./*.vue', { eager: true });
const componentData = Object.entries(modules).reduce((acc, [path, module]) => {
  const fileName = path.replace(/^\.\/(.*)\.vue$/, '$1');
  const componentName = `Config${fileName.replace(/(?:^|\.?)([A-Z])/g, (x, y) => y.toUpperCase())}`;
  acc[componentName] = module.default;
  return acc;
}, {} as Record<string, DefineComponent<{}, {}, any>>);
export default componentData