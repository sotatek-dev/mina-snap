export const handelCoppy = (data:string, id:string) => {
    // navigator.clipboard.writeText(privateKey as string);

    const storage = document.createElement('textarea');
    storage.value = data as string;
    const element = document.querySelector(id);
    (element as any).appendChild(storage);
    storage.select();
    storage.setSelectionRange(0, 99999);
    document.execCommand('copy');
    (element as any).removeChild(storage);
  };