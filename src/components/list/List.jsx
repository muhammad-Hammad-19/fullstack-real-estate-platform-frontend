import Card from "../card/Card";

function List({ posts }) {
  return (
    <div className="  flex flex-col gap:50px ">
      {posts.map((item) => (
        <Card key={item.id} item={item} />
      ))}
    </div>
  );
}

export default List;
