import IndexPage from '../index/index';

export function meta() {
  return [
    { title: "NathRacker" },
    { name: "description", content: "Register to your account" },
  ];
}

export default function Index() {

  return (<IndexPage />)

}
