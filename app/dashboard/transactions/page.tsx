export default function Page() {
  return (
    <>
      {/* <h1>Transactions</h1> */}
      <ul className="overflow-y-scroll pb-[77px]">
        {Array.from({ length: 100 })
          .map((_, i) => i + 1)
          .map((v: number) => (
            <div key={v}>{v}</div>
          ))}
      </ul>
    </>
  );
}
