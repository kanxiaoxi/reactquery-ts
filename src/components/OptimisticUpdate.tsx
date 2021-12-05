import React from 'react'
import { useMutation, useQueries, useQueryClient, UseQueryResult } from 'react-query';
import { ITodo } from '../lib/interfaces/ITodo';
import { fetchData, updateData } from "./utils";

interface IUpdateTodoParams {
  id: string;
  message: string
}

interface IContext {
  previousTodo: ITodo | undefined;
}

// 乐观更新 https://cangsdarm.github.io/react-query-web-i18n/guides&concepts/optimistic-updates
const OptimisticUpdate = () => {
  const queryClient = useQueryClient()
  // const {data:todos} = useQuery('todos',()=>fetchData<ITodo[]>("todos"))
  const todos: UseQueryResult<ITodo>[] = useQueries(
    ["1", "2", "3", "4", "5"].map((id) => {
      return {
        queryKey: ["todos", id],
        queryFn: () => fetchData<ITodo>(`todos/${id}`),
      };
    })
  );
  const mutation = useMutation<
    ITodo,
    Error,
    IUpdateTodoParams,
    IContext | undefined
  >(['updatetodo'],
    async ({ id, message }) => updateData(`todos/${id}`, { message }),
    // 测试乐观更新失败时的情况
    // async ({ id, message }) => updateData(`todosnotfound/${id}`, { message }),
    {
      // 当mutate调用时
      onMutate: async (updateTodo) => {
        // 撤销相关的查询（这样它们就不会覆盖我们的乐观更新）
        await queryClient.cancelQueries(["todos", updateTodo.id])
        // 保存前一次状态的快照
        const previousTodo = queryClient.getQueryData<ITodo>(["todos", updateTodo.id])
        // 执行乐观更新
        queryClient.setQueryData(["todos", updateTodo.id], updateTodo)
        // 返回具有快照值的上下文对象
        return { previousTodo }
      },
      // 如果失败，则使用onMutate返回的上下文回滚
      onError: (_error, updateTodo, context) => {
        queryClient.setQueryData(["todos", updateTodo.id], context?.previousTodo)
      },
      // 总是在错误或成功之后重新获取：
      onSettled: (_data, _error, _updateTodo, context) => {
        queryClient.invalidateQueries(["todos", context?.previousTodo?.id]);
      },
    }
  )
  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    const target = event.target as typeof event.target
      & {
        id: { value: string };
        message: { value: string }
      }
    const id = target.id.value
    const message = target.message.value
    mutation.mutate({ id, message })
  }
  return (
    <div>
      <form onSubmit={submit}>
        <label htmlFor="id">id:</label>
        <input type="text" id="id" name="id" />
        <label htmlFor="message">message:</label>
        <input type="text" id="message" name="message" />
        <button type="submit" >修改message内容</button>
      </form>
      {todos?.map(todo => {
        return <p key={todo.data?.id}>待办事项 - {todo.data?.message}</p>
      })}
    </div>
  )
}

export default OptimisticUpdate
