import Reconciler, { OpaqueHandle } from "react-reconciler";
import ReactReconciler from "react-reconciler";

type Type =
  | "root"
  | "slackButton"
  | "slackActions"
  | "slackSection"
  | "slackText";
type Props = any;
type Container = any;
type Instance = any;
type TextInstance = any;
type HydratableInstance = any;
type PublicInstance = any;
type HostContext = { type: Type };
type UpdatePayload = any;
type ChildSet = any;
type TimeoutHandle = any;
type NoTimeout = any;

const debug = (...args: any[]) => {
  // console.log(args);
};

class HostConfig
  implements
    ReactReconciler.HostConfig<
      Type,
      Props,
      Container,
      Instance,
      TextInstance,
      HydratableInstance,
      PublicInstance,
      HostContext,
      UpdatePayload,
      ChildSet,
      TimeoutHandle,
      NoTimeout
    > {
  getPublicInstance(instance: Instance | TextInstance) {
    // throw new Error("Method not implemented.");
  }
  getRootHostContext(rootContainerInstance: Container): HostContext {
    return { type: "root" };
  }
  getChildHostContext(
    parentHostContext: HostContext,
    type: Type,
    rootContainerInstance: Container
  ): HostContext {
    return { type };
  }
  prepareForCommit(containerInfo: Container): void {
    return;
  }
  resetAfterCommit(containerInfo: Container): void {
    return;
  }
  createInstance(
    type: Type,
    props: Props,
    rootContainerInstance: Container,
    hostContext: HostContext,
    internalInstanceHandle: OpaqueHandle
  ): Instance {
    if (type === "slackButton") {
      return {
        type: "button",
        value: props.value,
      };
    }

    if (type === "slackText") {
      return { type: "text" };
    }

    if (type === "slackActions") {
      return { type: "actions", elements: [] };
    }

    if (type === "slackSection") {
      return { type: "section", fields: [] };
    }

    throw Error("createInstance::" + JSON.stringify({ type }));
  }
  appendInitialChild(
    parentInstance: Instance,
    child: Instance | TextInstance
  ): void {
    debug("appendInitialChild");
    if (parentInstance.type === "actions") {
      parentInstance.elements.push(child);
      return;
    }

    if (parentInstance.type === "button") {
      parentInstance.text = child;
      return;
    }

    if (parentInstance.type === "section") {
      parentInstance.fields.push(child);
      return;
    }

    // todo, if parent has markdown props, propagate to the parent instance after replace
    if (parentInstance.type === "text") {
      parentInstance.type = child.type;
      parentInstance.text = child.text;
      return;
    }

    if (parentInstance.type === child.type) {
      parentInstance.text += child.text;
      return;
    }

    throw new Error(
      "appendInitialChild::" + JSON.stringify({ parentInstance, child })
    );
  }
  finalizeInitialChildren(
    parentInstance: Instance,
    type: Type,
    props: Props,
    rootContainerInstance: Container,
    hostContext: HostContext
  ): boolean {
    if (props.value === rootContainerInstance.value && props.onClick) {
      props.onClick();

      return true;
    }

    return false;
  }
  prepareUpdate(
    instance: Instance,
    type: Type,
    oldProps: Props,
    newProps: Props,
    rootContainerInstance: Container,
    hostContext: HostContext
  ) {
    debug("prepareUpdate");
    return true;
  }
  shouldSetTextContent(type: Type, props: Props): boolean {
    return false;
  }
  shouldDeprioritizeSubtree(type: Type, props: Props): boolean {
    // throw new Error("Method not implemented.");
    return false;
  }
  createTextInstance(
    text: string,
    rootContainerInstance: Container,
    hostContext: HostContext,
    internalInstanceHandle: OpaqueHandle
  ) {
    debug("createTextInstance");
    return {
      type: "plain_text",
      text,
    };
  }
  scheduleDeferredCallback(
    callback: () => any,
    options?: { timeout: number }
  ): any {
    // throw new Error("Method not implemented.");
  }
  cancelDeferredCallback(callbackID: any): void {
    // throw new Error("Method not implemented.");
  }
  setTimeout(
    handler: (...args: any[]) => void,
    timeout: number
  ): TimeoutHandle | NoTimeout {
    // throw new Error("Method not implemented.");
  }
  clearTimeout(handle: TimeoutHandle | NoTimeout): void {
    // throw new Error("Method not implemented.");
  }
  noTimeout: NoTimeout;

  now(): number {
    return Date.now();
  }
  isPrimaryRenderer: boolean;
  supportsMutation: boolean = true;
  supportsPersistence: boolean = false;
  supportsHydration: boolean = true;

  appendChildToContainer(
    container: Container,
    child: Instance | TextInstance
  ): void {
    if (Array.isArray(container?.blocks)) {
      container.blocks.push(child);
      return;
    }

    debug("appendChildToContainer");

    throw new Error("container is not an array");
  }

  appendChild(parentInstance: Instance, child: Instance | TextInstance): void {
    debug("appendChild");
  }

  commitTextUpdate(
    textInstance: TextInstance,
    oldText: string,
    newText: string
  ): void {
    debug("commitTextUpdate");
    textInstance.text = newText;
  }
  commitMount?(
    instance: Instance,
    type: Type,
    newProps: Props,
    internalInstanceHandle: Reconciler.Fiber
  ): void {
    debug("commitMount");
  }

  replaceContainerChildren?(container: Container, newChildren: ChildSet): void {
    debug("replaceContainerChildren", { container, newChildren });
  }
  resetTextContent(instance: Instance) {
    debug("resetTextContent");
  }
  commitUpdate?(
    instance: Instance,
    updatePayload: UpdatePayload,
    type: Type,
    oldProps: Props,
    newProps: Props,
    internalInstanceHandle: OpaqueHandle
  ): void {}

  insertBefore?(
    parentInstance: Instance,
    child: Instance | TextInstance,
    beforeChild: Instance | TextInstance
  ): void {
    debug("insertBefore", { parentInstance, child, beforeChild });
  }

  insertInContainerBefore?(
    container: Container,
    child: Instance | TextInstance,
    beforeChild: Instance | TextInstance
  ): void {
    debug("insertInContainerBefore", { container, child, beforeChild });
  }
  removeChild?(parentInstance: Instance, child: Instance | TextInstance): void {
    debug("removeChild", parentInstance, child);
  }
  removeChildFromContainer?(
    container: Container,
    child: Instance | TextInstance
  ): void {
    debug("removeChildFromContainer", {
      container,
      child,
    });
  }
}

function doRender(element: any, value?: string) {
  const reconcilerInstance = Reconciler(new HostConfig());
  const root = { value, blocks: new Array() };
  const container = reconcilerInstance.createContainer(root, false, false);

  reconcilerInstance.updateContainer(element, container, null, null);

  return root.blocks;
}

export function render(
  element: React.FunctionComponentElement<any>,
  value?: string
) {
  if (value) {
    doRender(element, value);
  }

  return doRender(element);
}
