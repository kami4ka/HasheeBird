export default class Utils {
    static circleIntersectsRectangle(circle, rect) {
        const deltaX = circle.x - Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
        const deltaY = circle.y - Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));
        return (deltaX * deltaX + deltaY * deltaY) < (circle.radius * circle.radius);
    }

    static circleIntersectsCircle(circle1, circle2) {
        const deltaX = circle1.x - circle2.x;
        const deltaY = circle1.y - circle2.y;

        return (deltaX * deltaX + deltaY * deltaY) < ((circle1.radius + circle2.radius) * (circle1.radius + circle2.radius));
    }
}