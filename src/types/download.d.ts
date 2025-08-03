/**
 *  Custom Type Declaration for 'downloadjs'
 * @author Joomyoung Park <joommm516@gmail.com>
 */
declare module 'downloadjs' {
  const download: (
    data: Blob | string,
    filename?: string,
    mimeType?: string,
  ) => void;
  export default download;
}
