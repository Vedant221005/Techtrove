import { Button } from "./ui/button";

export function CartItem({ item, onUpdateQuantity, onRemove }) {
  return (
    <div className="flex items-center justify-between space-x-4 border-b py-4">
      <div className="flex items-center space-x-4">
        <div className="relative h-16 w-16 overflow-hidden rounded">
          <img
            src={item.product.image}
            alt={item.product.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <h3 className="font-medium">{item.product.title || item.product.name}</h3>
          <p className="text-sm text-muted-foreground">
            ${item.product.price.toFixed(2)} × {item.quantity}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onUpdateQuantity(item._id, Math.max(1, item.quantity - 1))}
          >
            -
          </Button>
          <span className="w-8 text-center">{item.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
          >
            +
          </Button>
        </div>
        <Button
          variant="destructive"
          size="icon"
          className="h-8 w-8"
          onClick={() => onRemove(item._id)}
        >
          ×
        </Button>
      </div>
    </div>
  );
}