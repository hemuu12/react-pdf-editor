import React, { createContext, useContext } from "react";
import Drawable from "../write-pdf/drawables/Drawable";

const DocumentOperationsContext = createContext<DocumentOperationsState>(null!);
const DocumentOperationsDispatchContext =
  createContext<DocumentOperationsDispatch>(null!);

export function useDocumentOperations() {
  return useContext(DocumentOperationsContext);
}

export function useDocumentPageDrawables(pageNumber: number) {
  return (
    useContext(DocumentOperationsContext).drawablesOnPage[pageNumber] || []
  );
}

export function useDocumentOperationsDispatch() {
  return useContext(DocumentOperationsDispatchContext);
}

export function DocumentOperationsProvider({
  state,
  dispatchState,
  children,
}: {
  state: DocumentOperationsState;
  dispatchState: (newState: DocumentOperationsState) => void;
  children: React.ReactNode;
}) {
  state = state || initialState;

  const dispatch: DocumentOperationsDispatch = (action) => {
    const newState = reducer(state, action);
    dispatchState(newState);
  };

  return (
    <DocumentOperationsContext.Provider value={state}>
      <DocumentOperationsDispatchContext.Provider value={dispatch}>
        {children}
      </DocumentOperationsDispatchContext.Provider>
    </DocumentOperationsContext.Provider>
  );
}

// Contains document manipulations that can be undone/redone.
type DocumentOperationsState = {
  drawablesOnPage: {
    [pageNumber: number]: Drawable[];
  };
};
type DocumentOperationsDispatch = React.Dispatch<DocumentOperationsAction>;
type DocumentOperationsAction = UpdatePageDrawables | AddDrawables;

interface UpdatePageDrawables {
  type: "UPDATE_PAGE_DRAWABLES";
  pageNumber: number;
  updatedDrawables: Drawable[];
}

interface AddDrawables {
  type: "ADD_DRAWABLES";
  drawableForPage: {
    [pageNumber: number]: Drawable;
  };
}

const initialState: DocumentOperationsState = {
  drawablesOnPage: {},
};

function reducer(
  state: DocumentOperationsState,
  action: DocumentOperationsAction
): DocumentOperationsState {
  switch (action.type) {
    case "UPDATE_PAGE_DRAWABLES": {
      return {
        ...state,
        drawablesOnPage: {
          ...state.drawablesOnPage,
          [action.pageNumber]: action.updatedDrawables,
        },
      };
    }
    case "ADD_DRAWABLES": {
      const drawablesOnPage = {
        ...state.drawablesOnPage,
      };
      for (const [key, addedDrawable] of Object.entries(
        action.drawableForPage
      )) {
        const pageNum = Number(key);
        const prevDrawables = drawablesOnPage[pageNum] || [];
        drawablesOnPage[pageNum] = [...prevDrawables, addedDrawable];
      }
      return {
        ...state,
        drawablesOnPage,
      };
    }
  }
}
