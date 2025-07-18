import { ObjectiveDetail } from "@/components/objectives/objective-detail"

export default function ObjectiveDetailPage({ params }: { params: { id: string } }) {
  return <ObjectiveDetail objectiveId={params.id} />
}
