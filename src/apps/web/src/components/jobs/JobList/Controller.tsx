"use client";
import { useJobsContext } from "@/contexts/jobs";
import Loading from "./Loading";
import Empty from "./Empty";
import List from "./List";

export default function Controller() {
  const { isLoading, jobsById } = useJobsContext();
  const isEmpty = Object.keys(jobsById).length == 0;

  return (
    <div className="flex-1 min-h-0 h-full">
      {isLoading && <Loading />}
      {!isLoading && isEmpty && <Empty />}
      {!isLoading && !isEmpty && <List />}
    </div>
  )
}
