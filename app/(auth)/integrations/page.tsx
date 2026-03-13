import {
  IntegrationCard,
  IntegrationCardProps,
} from "../../../components/integrations/IntegrationCard";
import { Container } from "../../../components/ui/container";

const integrations: IntegrationCardProps[] = [
  {
    name: "Gmail",
    logoLetter: "G",
    logoColor: "#dc2626",
    status: "Tilkoblet",
    actionLabel: "Administrer",
    compact: true,
  },
  {
    name: "Outlook",
    logoLetter: "O",
    logoColor: "#2563eb",
    status: "Ikke tilkoblet",
    actionLabel: "Administrer",
    compact: true,
  },
  {
    name: "HubSpot",
    logoLetter: "H",
    logoColor: "#ea580c",
    status: "Tilkoblet",
    actionLabel: "Administrer",
  },
  {
    name: "Slack",
    logoLetter: "S",
    logoColor: "#7c3aed",
    status: "Tilkoblet",
    actionLabel: "Administrer",
  },
  {
    name: "Tripletex",
    logoLetter: "T",
    logoColor: "#6b7280",
    status: "Ikke tilkoblet",
    actionLabel: "Administrer",
  },
];

export default async function IntegrationsPage() {
  return (
    <div className="space-y-6">
      <Container>
        <div className="container-header pb-0">
          <h1 className="page-title">Integrasjoner</h1>
        </div>
      </Container>

      <Container>
        <div className="container-content grid gap-6 xl:grid-cols-2">
          {integrations.map((integration) => (
            <IntegrationCard key={integration.name} {...integration} />
          ))}
        </div>
      </Container>
    </div>
  );
}
