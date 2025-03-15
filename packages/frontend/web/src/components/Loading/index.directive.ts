import { Directive, createApp } from 'vue';
import Loading from './index.vue';

const loadingDirective: Directive = {
   mounted(el, binding) {
      el.style.position = 'relative';

      const loading = createApp(Loading);
      const container = document.createElement('div');
      const instance = loading.mount(container);

      instance.$el.style.position = 'absolute';
      instance.$el.style.top = '0';
      instance.$el.style.left = '0';

      const { width, height } = el.getBoundingClientRect();
      instance.$el.style.width = width + 'px';
      instance.$el.style.height = height + 'px';
      instance.$el.style.borderRadius = getComputedStyle(el).borderRadius;

      const observer = new ResizeObserver(() => {
         const { width, height } = el.getBoundingClientRect();
         instance.$el.style.width = width + 'px';
         instance.$el.style.height = height + 'px';
      });
      observer.observe(el);
      el.__observer = observer;

      const background =
         binding.value instanceof Object
            ? binding.value.background
            : 'rgba(255, 255, 255, 0.25)';
      instance.$el.style.backgroundColor = background;
      instance.$el.style.backdropFilter = 'blur(5px)';

      instance.$el.style.display = 'flex';
      instance.$el.style.justifyContent = 'center';
      instance.$el.style.alignItems = 'center';

      instance.$el.style.zIndex = '9999';
      instance.$el.style.transition = 'opacity 0.3s, backdrop-filter 0.3s';

      el.appendChild(instance.$el);
      el.__loading_instance = instance;

      const setStatus = (
         value: { show: boolean; background?: string } | boolean
      ) => {
         const show = typeof value === 'boolean' ? value : value.show;
         if (show) {
            el.__loading_instance.$el.style.opacity = '1';
            el.__loading_instance.$el.style.pointerEvents = 'auto';
            instance.$el.style.backdropFilter = 'blur(5px)';
         } else {
            el.__loading_instance.$el.style.opacity = '0';
            el.__loading_instance.$el.style.pointerEvents = 'none';
            instance.$el.style.backdropFilter = 'none';
         }
         if (value instanceof Object && value.background) {
            el.__loading_instance.$el.style.backgroundColor = value.background;
         }
      };
      setStatus(binding.value);

      el.__set_status = setStatus;
   },
   updated(el, binding) {
      el.__set_status(binding.value);
   },
   unmounted(el) {
      el.__loading_instance?.$destroy();
      delete el.__loading_instance;
      delete el.__set_status;
      el.__observer?.disconnect();
      delete el.__observer;
   },
};

export default loadingDirective;
