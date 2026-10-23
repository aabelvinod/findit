import { useNavigate, useParams, Link } from "react-router-dom";
import { SearchX, ArrowLeft } from "lucide-react";
import ItemModal from "../components/ItemModal";
import EmptyState from "../components/EmptyState";
import { useReports } from "../hooks/useReports";

export default function ItemDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { reports } = useReports();
  const report = reports.find((r) => r.id === id);

  if (!report) {
    return (
      <div className="container-page py-16">
        <EmptyState
          icon={<SearchX size={28} />}
          title="Report not found"
          description="This report may have been deleted, or the link is incorrect."
          action={
            <Link to="/browse" className="btn btn-primary btn-sm">
              <ArrowLeft size={15} /> Back to the board
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <ItemModal
      report={report}
      onClose={() => navigate("/browse")}
      onSelectReport={(next) => navigate(`/item/${next.id}`)}
    />
  );
}
