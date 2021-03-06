import { FC } from "react";
import { useQuery, UseQueryResult } from "react-query";
import { useParams } from "react-router-dom";
import { IPerson } from "../lib/interfaces/IPerson";
import PersonComponent from "./PersonComponent";

export const getPersonById = async (id: string | undefined):Promise<IPerson> => {
  if (typeof id === "string") {
    const res = await fetch(`http://localhost:4001/person/${id}`);
    if(res.ok){
      return await res.json();
    }
    throw new Error('请求错误')
  }
  throw new Error('id类型错误')

};

const Person: FC = () => {
  const {id} = useParams()
  const { status, error, data }: UseQueryResult<IPerson, Error> = useQuery<
    IPerson,
    Error,
    IPerson,
    [string, string|undefined]
  >(["person", id], ()=>getPersonById(id), {
    // staleTime: 5 * 1000,
    // cacheTime: 10,
    enabled: !!id,
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
      {/* Query Expoler observers 2 items */}
      <PersonComponent />
    </>
  );
};

export default Person;
