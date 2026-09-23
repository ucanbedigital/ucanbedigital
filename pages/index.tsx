import { GetServerSideProps } from 'next';

export default function RootIndex() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/tr',
      permanent: false,
    },
  };
};
