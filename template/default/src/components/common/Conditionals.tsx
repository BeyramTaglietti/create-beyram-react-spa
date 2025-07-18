import { Children, type ReactNode, isValidElement, useMemo } from "react";

type ShowProps<T> = {
  when: T;
  fallback?: ReactNode;
  children: ReactNode | ((item: NonNullable<T>) => ReactNode);
};

/**
 * Concept borrowed from Solid: https://www.solidjs.com/docs/latest/api#show
 *
 * Using <Show> can be an improvement over ternary or boolean expressions in some cases.
 *
 * @example
 * ```tsx
 * <Show when={!loading} fallback={<Spinner />}>
 *    <div>All done</div>
 * </Show>
 * ```
 *
 * @example
 * ```tsx
 * <Show when={data}>
 *   {({ foo }) => <div>{foo.bar}</div>}
 * </Show>
 * ```
 */
export function Show<T>({ when, fallback, children }: ShowProps<T>) {
  if (when) {
    if (typeof children === "function" && children.length > 0) {
      return <>{children(when)}</>;
    }

    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return null;
}

type MatchProps<T> = {
  when: T;
  children: ReactNode | ((item: NonNullable<T>) => ReactNode);
};

/**
 * Only renders when it is the first `<Match>` in a `<Switch>`
 * whose `when` prop is truthy.
 *
 * Borrowed from Solid: https://www.solidjs.com/docs/latest/api#switchmatch
 */
export function Match<T>({ when, children }: MatchProps<T>) {
  if (!when) {
    // This block should never execute based on the implementation of <Switch>
    return null;
  }

  if (typeof children === "function" && children.length > 0) {
    return <>{children(when)}</>;
  }

  return <>{children}</>;
}

type SwitchProps = {
  fallback?: ReactNode;
  children: ReactNode;
};

/**
 * Renders the first `<Match>` whose `when` prop is truthy.
 *
 * Borrowed from Solid: https://www.solidjs.com/docs/latest/api#switchmatch
 *
 * @example
 * ```tsx
 * <Switch fallback={<p>A fallback</p>}>
 *    <Match when={false}>
 *     <p>First match</p>
 *   </Match>
 *   <Match when={true}>
 *    <p>Second match</p>
 *   </Match>
 *   <Match when={data}>
 *    {({ foo }) => <p>{foo.bar}</p>}
 *   </Match>
 * </Switch>
 * ```
 */
export function Switch({ fallback, children }: SwitchProps) {
  const match = useMemo(
    () =>
      Children.toArray(children).find(
        (child) =>
          isValidElement<MatchProps<boolean>>(child) && // First React Element
          child.type === Match && // That is a <Match>
          child.props.when // Whose `when` prop is truthy
      ),
    [children]
  );

  if (match) {
    return <>{match}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return null;
}
