import { useEffect } from 'react';

const useTitle = (title: string) => {
  useEffect(() => {
    if (title) {
      const prevTitle = document.title;
      document.title = `${title} - Jirak`;

      return () => {
        document.title = prevTitle;
      };
    }
  }, [title]);
};

export default useTitle;
