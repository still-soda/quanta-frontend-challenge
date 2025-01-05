export type TagType =
   | 'primary'
   | 'secondary'
   | 'success'
   | 'danger'
   | 'warning'
   | 'info'
   | 'light'
   | 'dark';

export const TagColors = {
   primary: 'bg-blue-500 text-white',
   secondary: 'bg-gray-base text-white',
   success: 'bg-green-base text-white',
   danger: 'bg-red-base text-white',
   warning: 'bg-orange-high text-white',
   info: 'bg-blue-400 text-white',
   light: 'bg-gray-200 text-dark-normal',
   dark: 'bg-gray-800 text-white',
};
