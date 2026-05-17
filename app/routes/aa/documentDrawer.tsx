import { useParams } from "react-router"
import AaDocumentDrawer from "~/features/aa/AaDocumentDrawer"

export default function AaDocumentDrawerRoute() {
  const { moduleCode, id } = useParams<{ moduleCode: string; id: string }>()

  return <AaDocumentDrawer moduleCode={moduleCode ?? ""} documentId={id ?? ""} />
}
