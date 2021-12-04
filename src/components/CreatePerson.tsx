import React, { useState } from 'react'
import { useMutation, useQuery, useQueryClient, UseQueryResult } from 'react-query'
import { IPerson } from '../lib/interfaces/IPerson'

const createPerson = async ({id,name,age}:ICreatePersonParams):Promise<IPerson> => {
  console.log('hdf', name, age)
  const res:Response = await fetch(`http://localhost:4001/person/2`,{
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ id, name, age })
  })
  if (res.ok) {
    return await res.json()
  }

  throw new Error('创建person失败')
}

interface ICreatePersonParams extends IPerson {}
interface IContext {
  id: string;
}

const CreatePerson = () => {
  const [enabled, setEnabled] = useState(true)

  const { data: queryData }: UseQueryResult<IPerson, Error> = useQuery<IPerson, Error>('person', async():Promise<IPerson> => {
    const res = await fetch(`http://localhost:4001/person/2`);
    if(res.ok){
      return await res.json();
    }
    throw new Error('请求错误')
  
}, {
    enabled,
  });
  console.log('queryData->', queryData)


  const queryClient = useQueryClient()

  // https://react-query.tanstack.com/guides/mutations
  const mutation = useMutation<
  IPerson,
  Error,
  ICreatePersonParams,
  IContext | undefined
  >('createPerson',async({id, name, age})=>createPerson({id, name, age}), {
    // mutation 之前 
    onMutate:(variables: ICreatePersonParams)=>{
      console.log('mutation varaibles', variables)
        
        return { id: '1' }
        // return undefined;
    },
    // mutation 成功
    onSuccess: (data: IPerson, _variables: ICreatePersonParams, _context: IContext|undefined)=>{
      queryClient.invalidateQueries('person')
      // queryClient.setQueryData('person', data)
      return console.log('mutation data', data)
    },
    // mutation 错误
    onError: (error: Error, _variables: ICreatePersonParams, context: IContext | undefined) => {
      console.log('error: ', error.message);
      
      // 使用onMutate抛出的{id: '1'}
      return console.log(`使用 id:${context?.id} 回滚乐观更新`)
    },
    // mutation 成功还是错误都会执行
    onSettled:(_data?:IPerson,_error?:Error|null, _variables?: ICreatePersonParams, _context?: IContext)=>{
      console.log('mutation完成')
    }
  })
  
  const onSubmit = async (event: React.FormEvent) =>{
    event.preventDefault()
    const target = event.target as typeof event.target & {
      name: {value: string};
      age: {value: number}
    }
    const id = 2;
    const name = target.name.value
    const age = target.age.value
    mutation.mutate({id, name, age})
  }
  return (
    <>
      {mutation.isLoading ? <p>添加中...</p> : mutation.isError? <p>发生错误:{mutation?.error?.message}</p>: null}
      {mutation.isSuccess ? <p>添加person成功！name:{mutation?.data?.name} age:{mutation?.data?.age}</p>: null}
      
      <button 
      type="button"
      onClick={()=>{
        // 手动禁止重新query，并使缓存失效
        setEnabled(false);
        queryClient.invalidateQueries('person')
      }}
      >Invalidate Cache</button>
      
      <form onSubmit={onSubmit}>
        <label htmlFor="name">name:</label>
        <input type="text" id="name" name="name" />
        <br />
        <label htmlFor="age">age:</label>
        <input type="number" id="age" name="age" />
        <br />
        <input type="submit" value="提交" />
      </form>

      {
       
        queryData &&<>
        <h2>Person</h2>
        <p>ID：{queryData.id}</p>
        <p>名字：{queryData?.name}</p>
        <p>年龄：{queryData?.age}</p>
        </>
      }
    </>
  )

}

export default CreatePerson
