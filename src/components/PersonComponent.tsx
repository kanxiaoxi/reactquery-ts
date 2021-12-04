import { FC } from "react";
import { useQuery, UseQueryResult } from "react-query";
import { useParams } from "react-router-dom";
import { IPerson } from "../lib/interfaces/IPerson";
import { getPersonById } from "./Person";

const PersonComponent: FC = () => {
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
      <h2>Person Component</h2>
      <p>ID：{data?.id}</p>
      <p>名字：{data?.name}</p>
      <p>年龄：{data?.age}</p>
    </>
  );
};

export default PersonComponent;
