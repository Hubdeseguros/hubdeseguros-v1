import { Check, AlertCircle } from "lucide-react";

interface Task {
  id: string;
  title: string;
  priority: "high" | "medium" | "low" | "alta" | "media" | "baja"; // Added Spanish priority types
  dueDate?: string;
  completed?: boolean;
}

interface TaskListProps {
  tasks: Task[];
  title?: string;
  emptyMessage?: string;
}

const TaskList = ({
  tasks,
  title = "Tareas",
  emptyMessage = "No hay tareas pendientes",
}: TaskListProps) => {
  const getPriorityDot = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
      case "alta":
        return "bg-red-500";
      case "medium":
      case "media":
        return "bg-yellow-500";
      case "low":
      case "baja":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h3 className="font-semibold">{title}</h3>
      </div>
      <div className="p-4">
        {tasks.length === 0 ? (
          <p className="text-gray-500 text-center py-6">{emptyMessage}</p>
        ) : (
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex items-start p-3 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
              >
                <div className="flex-shrink-0 h-5 w-5 rounded-full border-2 border-gray-300 mr-3 flex items-center justify-center hover:border-hubseguros-primary hover:bg-hubseguros-primary/10 transition-colors">
                  <Check
                    className={`h-3 w-3 ${task.completed ? "text-hubseguros-primary" : "text-transparent"} hover:text-hubseguros-primary`}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <span
                      className={`h-2 w-2 rounded-full ${getPriorityDot(task.priority)} mr-2`}
                    ></span>
                    <p className="font-medium text-sm flex items-center gap-1">
                      {task.priority === "alta" && (
                        <AlertCircle className="text-red-500 h-4 w-4" />
                      )}
                      {task.title}
                    </p>
                  </div>
                  {task.dueDate && (
                    <p className="text-xs text-gray-500 mt-1">
                      Vencimiento: {task.dueDate}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TaskList;
