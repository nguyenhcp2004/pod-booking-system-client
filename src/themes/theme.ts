import { createTheme } from '@mui/material'

// Create your custom theme
export const tokens = (mode: 'light' | 'dark') => ({
  ...(mode === 'light'
    ? {
        primary: {
          50: '#e6eef5',
          100: '#b0cadf',
          200: '#8ab0cf',
          300: '#548cb9',
          400: '#3375ac',
          500: '#005397',
          600: '#004c89',
          700: '#003b6b',
          800: '#002e53',
          900: '#00233f'
        },
        secondary: {
          50: '#fff3f3',
          100: '#ffdada',
          200: '#ffc8c8',
          300: '#ffafaf',
          400: '#ff9fa0',
          500: '#ff8587',
          600: '#e87b7c',
          700: '#b56061',
          800: '#8c4a4b',
          900: '#6b3939'
        },
        grey: {
          50: '#ececee',
          100: '#c5c5ca',
          200: '#a9a9b1',
          300: '#82828d',
          400: '#6a6a77',
          500: '#454555',
          600: '#3f3f4d',
          700: '#31313c',
          800: '#26262f',
          900: '#1d1d24'
        },
        error: {
          50: '#feeceb',
          100: '#fcc5c1',
          200: '#faa9a3',
          300: '#f88178',
          400: '#f6695e',
          500: '#f44336',
          600: '#de3d31',
          700: '#ad3026',
          800: '#86251e',
          900: '#661c17'
        },
        warning: {
          50: '#fff6e9',
          100: '#ffe4bc',
          200: '#ffd79b',
          300: '#ffc46e',
          400: '#ffb951',
          500: '#ffa726',
          600: '#e89823',
          700: '#b5771b',
          800: '#8c5c15',
          900: '#6b4610'
        },
        success: {
          50: '#edf7ee',
          100: '#c8e6c9',
          200: '#addaaf',
          300: '#87c98a',
          400: '#70bf73',
          500: '#4caf50',
          600: '#459f49',
          700: '#367c39',
          800: '#2a602c',
          900: '#204a22'
        },
        info: {
          50: '#eaf8fe',
          100: '#bde8fc',
          200: '#9dddfb',
          300: '#70cef9',
          400: '#54c5f8',
          500: '#29b6f6',
          600: '#25a6e0',
          700: '#1d81af',
          800: '#176487',
          900: '#114c67'
        },
        dark: {
          50: '#000000',
          100: '#111111',
          200: '#333333',
          300: '#555555',
          400: '#777777',
          500: '#999999',
          600: '#BBBBBB',
          700: '#DDDDDD',
          800: '#EEEEEE',
          900: '#FFFFFF'
        }
      }
    : {
        primary: {
          50: '#e6eef5',
          100: '#b0cadf',
          200: '#8ab0cf',
          300: '#548cb9',
          400: '#3375ac',
          500: '#005397',
          600: '#004c89',
          700: '#003b6b',
          800: '#002e53',
          900: '#00233f'
        },
        secondary: {
          50: '#fff3f3',
          100: '#ffdada',
          200: '#ffc8c8',
          300: '#ffafaf',
          400: '#ff9fa0',
          500: '#ff8587',
          600: '#e87b7c',
          700: '#b56061',
          800: '#8c4a4b',
          900: '#6b3939'
        },
        grey: {
          50: '#ececee',
          100: '#c5c5ca',
          200: '#a9a9b1',
          300: '#82828d',
          400: '#6a6a77',
          500: '#454555',
          600: '#3f3f4d',
          700: '#31313c',
          800: '#26262f',
          900: '#1d1d24'
        },
        error: {
          50: '#feeceb',
          100: '#fcc5c1',
          200: '#faa9a3',
          300: '#f88178',
          400: '#f6695e',
          500: '#f44336',
          600: '#de3d31',
          700: '#ad3026',
          800: '#86251e',
          900: '#661c17'
        },
        warning: {
          50: '#fff6e9',
          100: '#ffe4bc',
          200: '#ffd79b',
          300: '#ffc46e',
          400: '#ffb951',
          500: '#ffa726',
          600: '#e89823',
          700: '#b5771b',
          800: '#8c5c15',
          900: '#6b4610'
        },
        success: {
          50: '#edf7ee',
          100: '#c8e6c9',
          200: '#addaaf',
          300: '#87c98a',
          400: '#70bf73',
          500: '#4caf50',
          600: '#459f49',
          700: '#367c39',
          800: '#2a602c',
          900: '#204a22'
        },
        info: {
          50: '#eaf8fe',
          100: '#bde8fc',
          200: '#9dddfb',
          300: '#70cef9',
          400: '#54c5f8',
          500: '#29b6f6',
          600: '#25a6e0',
          700: '#1d81af',
          800: '#176487',
          900: '#114c67'
        },
        dark: {
          50: '#000000',
          100: '#111111',
          200: '#333333',
          300: '#555555',
          400: '#777777',
          500: '#999999',
          600: '#BBBBBB',
          700: '#DDDDDD',
          800: '#EEEEEE',
          900: '#FFFFFF'
        }
      })
})

export const themeSettings = (mode: 'light' | 'dark') => {
  const colors = tokens(mode)
  return {
    palette: {
      mode: mode,
      ...(mode === 'light'
        ? {
            // palette values for light mode
            primary: {
              light: colors.primary[100],
              main: colors.primary[500], // xanh nước biển
              dark: colors.primary[700]
            },
            secondary: {
              light: colors.secondary[100],
              main: colors.secondary[500], // màu hồng
              dark: colors.secondary[700]
            },
            neutral: {
              light: colors.grey[100],
              main: colors.grey[500], // màu xám
              dark: colors.grey[700]
            },
            success: {
              light: colors.success[100],
              main: colors.success[500], // màu xanh lá
              dark: colors.success[700]
            },
            warning: {
              light: colors.warning[100],
              main: colors.warning[500], // màu vàng
              dark: colors.warning[700]
            },
            error: {
              light: colors.error[100],
              main: colors.error[500], // màu đỏ
              dark: colors.error[700]
            },
            info: {
              light: colors.info[100],
              main: colors.info[500],
              dark: colors.info[700]
            }

            // background: {
            //   default: colors.primary[500]
            // }
          }
        : {
            // palette values for dark mode
            primary: {
              light: colors.primary[100],
              main: colors.primary[500],
              dark: colors.primary[700]
            },
            secondary: {
              light: colors.secondary[100],
              main: colors.secondary[500],
              dark: colors.secondary[700]
            },
            neutral: {
              light: colors.grey[100],
              main: colors.grey[500],
              dark: colors.grey[700]
            },
            success: {
              light: colors.success[100],
              main: colors.success[500],
              dark: colors.success[700]
            },
            warning: {
              light: colors.warning[100],
              main: colors.warning[500],
              dark: colors.warning[700]
            },
            error: {
              light: colors.error[100],
              main: colors.error[500],
              dark: colors.error[700]
            },
            info: {
              light: colors.info[100],
              main: colors.info[500],
              dark: colors.info[700]
            }
          })
    },
    typography: {
      fontFamily: ['Roboto', 'sans-serif'].join(','),
      fontSize: 12,
      h1: {
        fontFamily: ['Roboto', 'sans-serif'].join(','),
        fontSize: 62
      },
      h2: {
        fontFamily: ['Roboto', 'sans-serif'].join(','),
        fontSize: 48
      },
      h3: {
        fontFamily: ['Roboto', 'sans-serif'].join(','),
        fontSize: 40
      },
      h4: {
        fontFamily: ['Roboto', 'sans-serif'].join(','),
        fontSize: 32
      },
      h5: {
        fontFamily: ['Roboto', 'sans-serif'].join(','),
        fontSize: 24
      },
      h6: {
        fontFamily: ['Roboto', 'sans-serif'].join(','),
        fontSize: 16
      }
    }
  }
}

export const theme = createTheme(themeSettings('light'))
