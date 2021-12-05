import React, { useState } from "react";
import {
  useQueries,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "react-query";
import { IPerson } from "../lib/interfaces/IPerson";
import { ITodo } from "../lib/interfaces/ITodo";
import { fetchData } from "./utils";

const PersonTodos = () => {
  const [enabled, setEnabled] = useState(true);
  const queryClient = useQueryClient();
  const {
    isLoading,
    isError,
    isSuccess: personSuccess,
    error,
    data: personData,
  }: UseQueryResult<IPerson[], Error> = useQuery<IPerson[], Error>(
    "person",
    () => fetchData<IPerson[]>("person"),
    {
      enabled,
    }
  );

  const {
    isSuccess: todoSuccess,
  }: UseQueryResult<ITodo, Error> = useQuery<ITodo, Error>(
    "todo",
    () => fetchData<ITodo>("todo"),
    {
      enabled,
    }
  );

  // dynamic parallel queries
  const todosQueries:UseQueryResult<ITodo>[] = useQueries(
    ["1", "2", "3", "4", "5"].map((id) => {
      return {
        queryKey: ["todo", { todoId: id }],
        queryFn: () => fetchData<ITodo>(`todos/${id}`),
      };
    })
  );
  console.log("todosQueries", todosQueries);

  if (personSuccess && todoSuccess && enabled) {
    setEnabled(false);
  }
  if (isLoading) {
    return (
      <div>
        <p>Loading....</p>
      </div>
    );
  }
  if (isError) return <p>Error: {error?.message}</p>;
  return (
    <div>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          queryClient.invalidateQueries();
        }}
      >
        使所有查询无效
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          queryClient.invalidateQueries("person");
        }}
      >
        使person查询无效
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          queryClient.invalidateQueries({
            // 使特定的 queyKey 无效
            predicate: (query: any) => {
              return parseInt(query.queryKey[1].todoId) % 2 === 1;
            },
          });
        }}
      >
        使todo的特定id查询无效
      </button>
      {
        personData?.map(person=>{
          return <>
          <br />
          <span>ID：{person?.id}</span>
          <span>名字：{person?.name}</span>
          <span>年龄：{person?.age}</span>
          <br />
        </>
        })
      }
      {
        todosQueries?.map(todo=>{
          return <div>待办事项 - {todo.data?.message}</div>
        })
      }
    </div>
  );
};

export default PersonTodos;
