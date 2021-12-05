export const fetchData = async <T>(path: string): Promise<T> =>{
  const res = await fetch(`http://localhost:4001/${path}`)
  if (!res.ok) {
    throw new Error("请求出错啦")
  }
  return await res.json()
}

export const updateData = async<T>(path:string, data: T): Promise<T> => {
  const res = await fetch(`http://localhost:4001/${path}`, {
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  if (!res.ok) {
    throw new Error("更新失败")
  }
  return await res.json()
}