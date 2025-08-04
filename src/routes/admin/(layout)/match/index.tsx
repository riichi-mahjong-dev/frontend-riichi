import { useNavigate } from "@solidjs/router";
import { clientOnly } from "@solidjs/start";
import { getMatches, Match } from "~/api/match";
import Button from "~/components/ui/Button";
import Pencil from "lucide-solid/icons/pencil";
import Eye from "lucide-solid/icons/eye";
import ClipboardCheck from "lucide-solid/icons/clipboard-check";
import Calculator from "lucide-solid/icons/calculator"; 
import { usePagination } from "~/compose/createSearchResource";
import { For, Index } from "solid-js";
import { writeDate, writeDateOnly } from "~/utils/common";
import SearchDropdown from "~/components/Form/SearchDropdown";
import { getPlayers, Player } from "~/api/player";
import Dropdown from "~/components/Layout/Dropdown";
import Funnel from "lucide-solid/icons/funnel";
import { MatchFilter } from "~/components/Layout/MatchFilter";

const TablePagination = clientOnly(() => import("~/components/Table/TablePagination"));

export default function MatchHome() {
  const navigate = useNavigate();
  const {
    data,
    page,
    setPage,
    hasMore,
    loading,
    setFilters,
  } = usePagination<Match, any>({
    fetcher: getMatches,
    pageSize: 5,
    initialSort: "-id",
  });

  return (
    <div class="flex flex-col bg-white p-8 rounded">
      <div class="flex flex-row justify-between px-4">
        <div class="text-xl font-bold">
          Table Match
        </div>
        <div>
          <Button
            size="lg"
            variant="outline"
            onClick={() => {
              navigate('/admin/match/create')
            }}
          >
            Create
          </Button>
        </div>
      </div>
      <div class="flex flex-row gap-4 p-4">
        <Dropdown
          trigger={(toggle) => (
            <Button
              variant="outline"
              fullWidth
              onClick={toggle}
              leftIcon={<Funnel/>}
            >
            Filter
            </Button>
          )}
        >
        {(toggle) => (
          <div class="p-6">
            <MatchFilter
              onApply={(start_date, end_date) => {
                if (start_date && end_date) {
                  setFilters((prev) => {
                    return {...prev, 'created_between': `${writeDateOnly(start_date)},${writeDateOnly(end_date)}`}
                  });
                  toggle();
                }
              }}
            />
          </div>
        )}
        </Dropdown>
        <SearchDropdown
          multi
          fetchData={async (query, page) => {
            const player = await getPlayers({
              page:page,
              pageSize: 10,
              search: query,
            });

            return {
              items: player.list,
              hasMore: player.list.length > 0,
            }
          }}
          getLabel={(item: Player) => {
            return item.name;
          }}
          onSelect={(item) => {
            setFilters((prev) => {
              return {...prev, 'match_players.player_id': item.map((player) => player.id).join(",")}
            })
          }}
          placeholder="Select Player Name"
        />
      </div>
      <TablePagination
        headers={[
          { key: "id", label: "ID" },
          { key: "username", label: "Creator" , value(row) {
              const match = row as Match;
              return (
                <>
                  {match.creator ? match.creator.name : 'By Admin'}
                </>
              )
          },
          },
          { key: 'players', label: 'Players', value(row) {
            const match = row as Match;
            return (
              <div class="flex flex-col">
                <For each={match.match_players}>
                  {(matchPlayer) => (
                    <span>- {matchPlayer.player.name}</span>
                  )}
                </For>
              </div>
            );
          },
          },
          { key: "approved", label: "Approved By", value(row) {
              const match = row as Match;
              return (
                <>
                  {match.approver ? match.approver.username : '-'}
                </>
              )
          },
          },
          { key: "created_at", label: "Created At" },
          { key: "updated_at", label: "Updated At" },
        ]}
        data={data}
        page={page}
        setPage={setPage}
        hasMore={hasMore}
        loading={loading}
        setData={(key, value) => {
          if (['created_at', 'updated_at'].includes(key)) {
            return writeDate(new Date(value));
          }

          return value;
        }}
        renderActions={(data) => {
          const parlour = data as Match;
          return (
            <div class="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                class="hover:bg-gray-200"
                onClick={() => {
                  navigate(`/admin/match/${parlour.id}`)
                }}
              >
                <Eye size={16} />
              </Button>
              <Button
                size="sm"
                variant="outline"
                class="hover:bg-gray-200"
                onClick={() => {
                  navigate(`/admin/match/${parlour.id}/edit`)
                }}
              >
                <Pencil size={16} />
              </Button>
              <Button
                size="sm"
                variant="outline"
                class="hover:bg-gray-200"
                onClick={() => {
                  navigate(`/admin/match/${parlour.id}/point`)
                }}
              >
                <Calculator size={16} />
              </Button>
              <Button
                size="sm"
                variant="outline"
                class="hover:bg-gray-200"
                onClick={() => {
                  navigate(`/admin/match/${parlour.id}/approve`)
                }}
              >
                <ClipboardCheck size={16} />
              </Button>
            </div>
          );
        }}
      />
    </div>
  )
}
