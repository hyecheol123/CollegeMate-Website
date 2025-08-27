declare module '*.module.css';
declare module '*.png';
declare module '*.png?as=webp';
declare module '*.png?as=avif';
declare module '*.svg' {
  const content: string;
  export default content;
}
