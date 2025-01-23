import { useState, useEffect } from "react";
import { Card, Typography, Button } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { ActionLogsGet } from "../../features/GroupApiSlice";
import moment from "moment";

const ActionLogBody = () => {
  const dispatch = useDispatch();
  const { actionLogs, actionLogLoading } = useSelector(
    (state) => state.groupdata
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState("all");

  useEffect(() => {
    dispatch(ActionLogsGet());
  }, [dispatch]);

  const actionTypes = [
    "all",
    "Create Student",
    "Update Student",
    "Delete Student",
    "Create Course",
    "Update Course",
    "Delete Course",
    "Create Batch",
    "Create Status",
    "Create Voucher",
  ];

  const filteredLogs = actionLogs
    ?.slice()
    .reverse()
    .filter((log) => {
      const matchesSearch =
        log.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user?.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user?.staffId?.includes(searchTerm);

      const matchesAction =
        filterAction === "all" || log.action === filterAction;

      return matchesSearch && matchesAction;
    });

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = filteredLogs?.slice(firstIndex, lastIndex);
  const npage = Math.ceil((filteredLogs?.length || 0) / recordsPerPage);

  return (
    <div className="bg-[#F5F5F5] min-h-screen">
      <div className="mb-8">
        <h2 className="text-[1.5rem] font-semibold text-c-grays">
          Action Logs
        </h2>
      </div>

      <Card className="overflow-hidden bg-white">
        <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col md:flex-row gap-4 items-center w-full">
            <div className="w-full md:w-72">
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="w-full md:w-48 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-c-purple"
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
            >
              {actionTypes.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-4 border-b border-gray-100">
                  <Typography className="text-c-grays font-semibold">
                    Action
                  </Typography>
                </th>
                <th className="p-4 border-b border-gray-100">
                  <Typography className="text-c-grays font-semibold">
                    Details
                  </Typography>
                </th>
                <th className="p-4 border-b border-gray-100">
                  <Typography className="text-c-grays font-semibold">
                    User
                  </Typography>
                </th>
                <th className="p-4 border-b border-gray-100">
                  <Typography className="text-c-grays font-semibold">
                    Timestamp
                  </Typography>
                </th>
              </tr>
            </thead>
            {actionLogLoading ? (
              <tbody>
                {[1, 2, 3, 4, 5].map((index) => (
                  <tr key={index}>
                    <td className="p-4 border-b border-gray-100">
                      <div className="skeleton h-4 w-32"></div>
                    </td>
                    <td className="p-4 border-b border-gray-100">
                      <div className="skeleton h-4 w-72"></div>
                    </td>
                    <td className="p-4 border-b border-gray-100">
                      <div className="skeleton h-4 w-48"></div>
                    </td>
                    <td className="p-4 border-b border-gray-100">
                      <div className="skeleton h-4 w-32"></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <tbody>
                {records?.map((log) => (
                  <tr key={log._id} className="hover:bg-gray-50">
                    <td className="p-4 border-b border-gray-100">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          log.action.includes("Create")
                            ? "bg-green-100 text-green-800"
                            : log.action.includes("Update")
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 border-b border-gray-100">
                      <Typography className="text-c-grays">
                        {log?.details}
                      </Typography>
                    </td>
                    <td className="p-4 border-b border-gray-100">
                      <div>
                        <Typography className="text-c-grays font-medium">
                          {log?.user?.Name}
                        </Typography>
                        <Typography className="text-sm text-gray-500">
                          {log?.user?.email}
                        </Typography>
                        <Typography className="text-sm text-gray-500">
                          Staff ID: {log?.user?.staffId}
                        </Typography>
                      </div>
                    </td>
                    <td className="p-4 border-b border-gray-100">
                      <Typography className="text-c-grays">
                        {moment(log.timestamp).format("MMM DD, YYYY HH:mm:ss")}
                      </Typography>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>

        <div className="p-4 flex items-center justify-between border-t border-gray-100">
          <Typography className="text-c-grays">
            Page {currentPage} of {npage || 1}
          </Typography>
          <div className="flex gap-2">
            <Button
              variant="outlined"
              size="sm"
              className="text-c-purple border-c-purple"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outlined"
              size="sm"
              className="text-c-purple border-c-purple"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, npage))
              }
              disabled={currentPage === npage || !npage}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ActionLogBody;
