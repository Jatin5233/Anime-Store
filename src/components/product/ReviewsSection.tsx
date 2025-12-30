export default function ReviewsSection({ reviews = [] }: { reviews?: any[] }) {
  if (reviews.length === 0) {
    return (
      <div className="mt-12 text-gray-400">
        No reviews yet.
      </div>
    );
  }

  return <div>{/* render reviews */}</div>;
}
