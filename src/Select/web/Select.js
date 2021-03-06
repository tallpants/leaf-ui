import React from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import pluralize from '../../utils/pluralize';
import Text from '../../Text/web';
import Spacer from '../../Spacer/web';
import Checkbox from '../../Checkbox/web';
import Container from './Container';
import Trigger from './Trigger';
import Label from './Label';
import TriggerArrows from './TriggerArrows';
import OptionList from './OptionList';
import Option from './Option';

class Select extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      selectedOptions: this.getDefaultSelected(props, context),
    };
  }

  onChange = (selectedOptions) => {
    const { name, onChange } = this.props;
    const { formik } = this.context;
    if (formik) {
      formik.setFieldValue(name, selectedOptions);
      formik.setFieldTouched(name, true);
    }
    if (onChange) {
      onChange(selectedOptions);
    }
  }

  onSelect = (selectedOption) => {
    const { selectedOptions } = this.state;
    const { multiple } = this.props;

    if (multiple) {
      let newSelectedOptions = [];
      if (selectedOptions.includes(selectedOption)) {
        // multiple: remove option
        newSelectedOptions = selectedOptions
          .filter((option) => option.value !== selectedOption.value);
      } else {
        // multiple: add option
        newSelectedOptions = [
          ...selectedOptions,
          selectedOption,
        ];
      }
      this.setState({
        selectedOptions: newSelectedOptions,
      }, () => this.onChange(newSelectedOptions));
    } else {
      // single: select option
      this.setState({
        selectedOptions: [selectedOption],
      }, () => this.onChange(selectedOption));
    }
  }

  getDefaultSelected = (props, context) => {
    const { name, defaultSelected } = props;
    const { formik } = context;
    let defaultSelectedOptions = [];

    if (defaultSelected) {
      defaultSelectedOptions = defaultSelectedOptions.concat(defaultSelected || []);
    } else if (formik) {
      defaultSelectedOptions = defaultSelectedOptions.concat(formik.values[name] || []);
    }

    if (formik && defaultSelected) {
      formik.setFieldValue(name, defaultSelected);
    }

    return defaultSelectedOptions;
  }

  getTriggerText = (selectedOptions) => {
    const { label, multiple } = this.props;
    if (!selectedOptions.length) {
      return <span>&nbsp;</span>;
    } else if (multiple) {
      return `${selectedOptions.length} ${pluralize(selectedOptions.length, label)}`;
    }
    return selectedOptions[0].label;
  }

  itemToString = (option) =>
    option == null ? '' : String(option.value)

  render() {
    const {
      selectedOptions,
    } = this.state;

    const {
      className,
      name,
      label,
      disabled,
      block,
      multiple,
      options,
      error: errorMessage,
    } = this.props;

    const {
      formik,
    } = this.context;

    const error = formik
      ? formik.touched[name] && formik.errors[name]
      : errorMessage;

    return (
      <Downshift
        selectedItem={selectedOptions}
        onSelect={this.onSelect}
        itemToString={this.itemToString}
        render={({
          isOpen,
          getRootProps,
          getButtonProps,
          getItemProps,
          highlightedIndex,
          selectedItem: dsSelectedOptions,
        }) => (
          <Container
            {...getRootProps({
              className,
              refKey: 'innerRef',
            })}
          >
            <Trigger
              {...getButtonProps({
                isOpen,
                block,
                disabled,
                error,
              })}
            >
              <Label
                isOpen={isOpen}
                hasValue={dsSelectedOptions.length}
                disabled={disabled}
                error={error}
              >
                {label}
              </Label>
              <Text size="s" truncate>
                {this.getTriggerText(dsSelectedOptions)}
              </Text>
              <TriggerArrows />
            </Trigger>
            <div style={{ position: 'relative' }}>
              {
                isOpen ? (
                  <OptionList block={block}>
                    {
                      options.map((option, index) => (
                        <Option
                          {...getItemProps({
                            key: option.value,
                            index,
                            item: option,
                            isActive: highlightedIndex === index,
                            isSelected: dsSelectedOptions.includes(option),
                          })}
                        >
                          {
                            multiple ? (
                              <Spacer padding={[0]}>
                                <Checkbox
                                  readOnly
                                  label={option.label}
                                  checked={dsSelectedOptions.includes(option)}
                                />
                              </Spacer>
                            ) : (
                              <Text>
                                {option.label}
                              </Text>
                            )
                          }
                        </Option>
                      ))
                    }
                  </OptionList>
                ) : null
              }
            </div>
            {
              error ? (
                <Spacer margin={[0.5, 0, 0, 0]}>
                  <Text color="red" size="xxs">
                    {error}
                  </Text>
                </Spacer>
              ) : null
            }
          </Container>
        )}
      />
    );
  }
}

Select.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.string,
  disabled: PropTypes.bool,
  block: PropTypes.bool,
  multiple: PropTypes.bool,
  options: PropTypes.array.isRequired,
  defaultSelected: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  error: PropTypes.string,
  onChange: PropTypes.func,
};

Select.defaultProps = {
  name: 'defaultName',
  label: 'defaultLabel',
  disabled: false,
  multiple: false,
};

Select.contextTypes = {
  formik: PropTypes.object,
};

export default Select;
