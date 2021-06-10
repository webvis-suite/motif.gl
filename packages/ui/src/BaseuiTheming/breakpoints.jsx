/* eslint-disable import/prefer-default-export */
/*
Copyright (c) 2018-2020 Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/
// @flow

import * as React from "react"
import { LightTheme } from "baseui"
import { Property } from "./common"

export function Breakpoint({ name, media = false }) {
  return (
    <Property
      name={name}
      concern={media ? "mediaQuery" : "breakpoints"}
      renderValue={() =>
        media
          ? LightTheme.mediaQuery[name]
          : `${LightTheme.breakpoints[name]}px`
      }
    />
  )
}