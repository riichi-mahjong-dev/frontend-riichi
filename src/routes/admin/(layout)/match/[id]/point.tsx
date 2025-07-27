import { useParams } from "@solidjs/router";

export default function DetailParlour() {
  const params = useParams();

  return (
    <div>
      {params.id}
    </div>
  );
}
