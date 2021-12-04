import { FC } from "react";
import { useQuery, UseQueryResult } from "react-query";
import { IPerson } from "../lib/interfaces/IPerson";

const fetchPerson = async ():Promise<IPerson> => {
  const res = await fetch("http://localhost:4001/person/1");
  // 与axios不同，fetch不会自动抛出错误
  if(res.ok){
    return await res.json();
  }
  // react-query 需要有错误抛出
  throw new Error('请求出现错误')

};

const Person: FC = () => {
  const { status, error, data }: UseQueryResult<IPerson, Error> = useQuery<
    IPerson,
    Error,
    IPerson,
    string
  >("person", fetchPerson, {
    // staleTime: 5 * 1000,
    // cacheTime: 10,
    // enabled:
    select: (person) => ({ ...person, name: "法外狂徒" + person.name }),
  });
  if (status === "loading") {
    return (
      <div>
        <p>Loading....</p>
      </div>
    );
  }
  if (error) return <p>Error: {error?.message}</p>;
  return (
    <>
      <p>ID：{data?.id}</p>
      <p>名字：{data?.name}</p>
      <p>年龄：{data?.age}</p>
    </>
  );
};

export default Person;
