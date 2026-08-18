import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "./ui/card";

interface Application {
  id: number;
  company: string;
  position: string;
  status: string;
  notes?: string;
}

interface ApplicationCardProps {
  application: Application;
  onDelete: (id: number) => void;
}

function ApplicationCard({
  application,
  onDelete
}: ApplicationCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>
              {application.company}
            </CardTitle>

            <p className="mt-1 text-sm text-slate-500">
              {application.position}
            </p>
          </div>

          <Badge>
            {application.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        {application.notes && (
          <p className="mb-4 text-sm text-slate-600">
            {application.notes}
          </p>
        )}

        <Button
          variant="destructive"
          size="sm"
          onClick={() =>
            onDelete(application.id)
          }
        >
          Delete
        </Button>
      </CardContent>
    </Card>
  );
}

export default ApplicationCard;