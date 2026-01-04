"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: string;
}

interface UserInfo {
  pageSize: number;
  pageNum: number;
  lowerLoading: boolean;
  refresherTriggered: boolean;
  nomore: boolean;
  empty: boolean;
  data: User[];
  total: number;
}

export default function UsersPage() {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    pageSize: 20,
    pageNum: 1,
    lowerLoading: false,
    refresherTriggered: false,
    nomore: false,
    empty: false,
    data: [],
    total: 0,
  });

  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async (page: number = 1) => {
    console.log("fetching users");

    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/admin/users?pageNum=${page}&pageSize=${userInfo.pageSize}`
      );
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();

      setUserInfo((prev) => {
        return {
          ...prev,
          data: data.data,
          total: data.total,
          pageNum: data.pageNum,
          pageSize: data.pageSize,
          empty: data.data.length === 0,
          nomore: data.data.length < prev.pageSize,
        };
      });
    } catch (error) {
      console.error(error);
      alert("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("useEffect fetching users");

    fetchUsers(userInfo.pageNum);
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > Math.ceil(userInfo.total / userInfo.pageSize))
      return;
    fetchUsers(newPage);
  };

  const totalPages = Math.ceil(userInfo.total / userInfo.pageSize);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold leading-6 text-gray-900 dark:text-white">
              Users
            </h1>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-400">
              A list of all the users in your account including their name,
              email, and verification status.
            </p>
          </div>
        </div>

        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                {isLoading ? (
                  <div className="flex justify-center p-12 bg-white dark:bg-gray-800">
                    <svg
                      className="animate-spin h-8 w-8 text-indigo-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span className="ml-3 text-gray-500 dark:text-gray-400">
                      Loading users...
                    </span>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                        >
                          Email
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                        >
                          Created At
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                      {userInfo.data.map((user) => (
                        <tr key={user.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">
                            <div className="flex items-center">
                              {user.image ? (
                                <Image
                                  src={user.image}
                                  alt=""
                                  width={32}
                                  height={32}
                                  className="h-8 w-8 rounded-full mr-3"
                                />
                              ) : (
                                <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 flex items-center justify-center mr-3 font-bold text-xs uppercase">
                                  {user.name.charAt(0)}
                                </div>
                              )}
                              {user.name}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                            {user.email}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                            <span
                              className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                                user.emailVerified
                                  ? "bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-900/30 dark:text-green-400 dark:ring-green-900/50"
                                  : "bg-yellow-50 text-yellow-800 ring-yellow-600/20 dark:bg-yellow-900/30 dark:text-yellow-500 dark:ring-yellow-900/50"
                              }`}
                            >
                              {user.emailVerified ? "Verified" : "Unverified"}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {userInfo.empty && !isLoading && (
                  <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                    No users found.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Pagination */}
        {userInfo.total > 0 && (
          <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 px-4 py-3 sm:px-6 mt-4">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(userInfo.pageNum - 1)}
                disabled={userInfo.pageNum === 1}
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(userInfo.pageNum + 1)}
                disabled={userInfo.pageNum >= totalPages}
                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-400">
                  Showing{" "}
                  <span className="font-medium">
                    {(userInfo.pageNum - 1) * userInfo.pageSize + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(
                      userInfo.pageNum * userInfo.pageSize,
                      userInfo.total
                    )}
                  </span>{" "}
                  of <span className="font-medium">{userInfo.total}</span>{" "}
                  results
                </p>
              </div>
              <div>
                <nav
                  className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => handlePageChange(userInfo.pageNum - 1)}
                    disabled={userInfo.pageNum === 1}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 dark:ring-gray-600 dark:hover:bg-gray-800"
                  >
                    <span className="sr-only">Previous</span>
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  {/* Generate page numbers dynamically - simplified for now */}
                  {Array.from({ length: Math.min(5, totalPages) }).map(
                    (_, i) => {
                      // Logic to show a window of pages could be added here
                      // For now, simpler logic to just show first 5 pages or context-aware logic
                      let p = i + 1;
                      // Center around current page if possible
                      if (totalPages > 5) {
                        if (userInfo.pageNum > 3) {
                          p = userInfo.pageNum - 2 + i;
                        }
                        if (p > totalPages) p = p - (p - totalPages);
                      }

                      return (
                        <button
                          key={p}
                          onClick={() => handlePageChange(p)}
                          aria-current={
                            userInfo.pageNum === p ? "page" : undefined
                          }
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                            userInfo.pageNum === p
                              ? "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                              : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0 dark:text-gray-300 dark:ring-gray-600 dark:hover:bg-gray-800"
                          }`}
                        >
                          {p}
                        </button>
                      );
                    }
                  )}

                  <button
                    onClick={() => handlePageChange(userInfo.pageNum + 1)}
                    disabled={userInfo.pageNum >= totalPages}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 dark:ring-gray-600 dark:hover:bg-gray-800"
                  >
                    <span className="sr-only">Next</span>
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
